const Algorithm = {};
const { query, locolla_query } = require('../db');
const admin = require("firebase-admin");
// const google = require('google-auth-library');
const serviceAccount = require("../../serviceAccountKey.json");
const e = require('express');
const Rules = require('./NotificationRules')
const Helper = require('../util/helper');
const PushNotification = require('./PushNotification');
const NC = require('./NotificationCenter')
const FlowControl = require('./FlowControl');
const Validate = require('../util/validate');
const list = "location_prioritized_list"

const district = 'district'
const weather = 'Weather_hourly_log'
const warning = 'warning_log'
//const roadworks = 'roadworks'
const traffic = 'special_traffic_log'
const journey = 'journey_time'
const street = 'journey_time_street'
const congestion = 'journey_time_congestion'
const parameters = 'parameters'
const rule = 'notification_rules'
const profile = 'user_profile'
const locollaDB = 'locobike'
const locolla_users = 'bc_1100_users'
const processingDB = 'locolla_data_processing'
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://silken-agent-325406-default-rtdb.asia-southeast1.firebasedatabase.app"
// });

const jsonTryParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};

const handlingRegionWeather = (data) => {

  const stmt = `Select * from ${district}`


}

// const hanldingWarning = (warning) => {

// }

// const handlingRoadWork = (roadWork) => {

// }

// const handlingSpecialTraffic = (traffic) => {

// }

const selectLatestWeatherRecord = async () => {

  //select weather.*,  warning.Contents from `Weather_hourly_log` as weather, `warning_log` as warning WHERE weather.WarningID in ( select WarningID from warning_log WHERE WarningID in (select MAX(WarningID) from warning_log GROUP by language) AND `language` IS NOT NULL) AND weather.WarningID = warning.WarningID       

  // const stmt = `Select ${weather}.*, ${district}.name_en, ${warning}.Contents, ${warning}.warningStatementCode, ${warning}.subType  from ${weather}, ${district}, ${warning}
  //   where ${district}.id = ${weather}.DistrictID and ${warning}.WarningID = ${weather}.WarningID and ${weather}.created_at in (Select MAX(created_at) from ${weather} group by DistrictID, language)`
  //console.log(stmt)
  const stmt = `Select w.*, d.id ,d.name_en from ${weather} w, ${district} d
                Where d.id = w.DistrictID AND created_at in (Select max(created_at) from ${weather} w group by w.DistrictID)`

  //console.log(stmt)

  const result = await query(stmt)

  return result
}

const selectWarnings = async () => {
  const stmt = `Select *, GROUP_CONCAT(Contents ORDER BY language SEPARATOR ";") as multiLang from ${warning} where created_at >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) `
  const result = await query(stmt)
  //console.log(stmt)

  return result

}


const selectTrafficRules = async () => {
  console.log('selecting')
  const stmt = `SELECT ${rule}.*, ${parameters}.check_item FROM ${rule}, ${parameters} WHERE ${rule}.type = ${parameters}.value and ${parameters}.type = 'traffic' order by priority`
  console.log(stmt)
  const result = await query(stmt)
  //console.log(result)
  return result
}

const selectSpecialTraffic = async (type) => {

  const stmt = `Select *, GROUP_CONCAT(content ORDER BY language SEPARATOR ";" ) as all_contents from ${traffic} where incident_number in (Select incident_number from ${traffic} where created_at >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) AND incident_heading = ?) group by incident_number `
  const result = await query(stmt, [type])
  return result

}


const selectTrafficByRoad = async (condition) => {
  const json = jsonTryParse(condition)
  console.log("Finding traffic jam")
  const speed = json.speed
  const occupancy = json.occupancy
  //console.log(json)
  const stmt = `Select c.*, st.Road_en, st.Road_tc, st.Road_sc from 
                (Select *, max(speed) as max_speed, min(occupancy) as min_occupancy FROM ${journey} GROUP BY road_id ) c 
                INNER JOIN ${street} st
                where c.road_id = st.id AND c.max_speed < ? AND c.min_occupancy > ? GROUP BY road_id`

  const result = await query(stmt, [speed, occupancy])
  //console.log(result)

  return result

}





const selectWeatherRule = async () => {

  // const stmt = `Select value from ${parameters} where type = weather`
  // const weatherParameters = await query(stmt)
  console.log("Finding rule")
  // should use id referening, but required to build different tables? for referening
  const stmt = `SELECT ${rule}.*, ${parameters}.check_item, ${parameters}.code FROM ${rule}, ${parameters} WHERE ${rule}.type = ${parameters}.value and ${parameters}.type = 'weather' order by priority`
  //console.log(stmt)
  const weatherRules = await query(stmt)

  return weatherRules

}
// no need, aleady selected
// const selectWarning = async(warningID)=>{
//   const stmt = `Select ${warning}.Contents from ${warning} where ${warning}.WarningID = ${warningID}`

//   const result = await query(stmt)

//   return result
// }

// const selectUserByDistrict = async (warningInfo) => {
//   //console.log(warningInfo)
//   const { ruleID, audience, type, operator, marks, priority, warnings } = warningInfo
//   //console.log(type)
//   //const newWarning = [...warnings]
//   //console.log(type)
//   // const districts = []
//   // //console.log(warnings)
//   // //if (warnings.district) {
//   // warnings.map((warning, index) => {
//   //   if (warning.district) {
//   //     districts.push('"' + warning.district + '"')
//   //   }
//   // })
//   //}

//   // console.log("DDDDDDDDDDDDDDDDDDDDDDDDDD")
//   // console.log(districts)
//   // console.log("??????????????????????????????")

//   const stmt = `Select * from ${profile}`
//   //const stmt2 = `Select name_tc as name from ${district} where id in (${districts.join(',')})`

//   //if not district ID, stmt2 will return empty array
//   // console.log(stmt2)

//   const users = await query(stmt)
//   //const selectedDistrict = await query(stmt2)
//   //const final = []


//   const newWarnings = await Promise.all(warnings.map(async (warning) => {
//     //const newWarning = []
//     //console.log(warning.language)
//     //warning.rule_id = ruleID

//     var stmt2 = ''
//     var result2 = []

//     if (type === 'region') {
//       stmt2 = `Select id, name_tc as name from ${district} where id = ${warning.district}`
//       result2 = await query(stmt2)

//     }

//     const selectedID = result2[0]?.id
//     const selectedName = result2[0]?.name

//     //console.log(result2)

//     await Promise.all(users.map(async (user, index) => {
//       var maxDistrict = {}
//       if (user.profile) {
//         for (var [key, value] of Object.entries(JSON.parse(user.profile))) {

//           if (key == audience) {
//             Object.entries(value).map(([key2, value2], index2) => {
//               if (type === 'region') {
//                 console.log('Finding location ' + selectedName + " current: " + key2 + " value: " + value2)
//                 if (key2 === selectedName && Helper.getEquations(value2, operator, marks)) {
//                   console.log('checking max district')
//                   if (Object.keys(maxDistrict).length === 0 || value2 > Object.values(maxDistrict)[0]) {
//                     const newObject = new Object()
//                     newObject[selectedID] = value2
//                     maxDistrict = newObject
//                     console.log(maxDistrict)
//                   }
//                 }
//               } else {
//                 if (Helper.getEquations(value2, operator, marks) && (Object.keys(maxDistrict).length === 0 || value2 > Object.values(maxDistrict)[0])) {
//                   const newObject = new Object()
//                   newObject['max'] = value2
//                   maxDistrict = newObject
//                   // console.log(maxDistrict)
//                 }
//               }

//             })
//           }
//         }
//       }

//       //if (Object.keys(maxDistrict).length !== 0) console.log(maxDistrict)
//       if (Object.keys(maxDistrict).length !== 0) {
//         console.log(user.lang)
//         console.log(warning.language)
//       }
//       if (Object.keys(maxDistrict).length === 1 && user.lang === warning.language) {
//         // console.log(user.lang)
//         // console.log(warning.language)
//         warning.rule_id = ruleID
//         warning.priority = priority
//         const stmt3 = `Select token from user_testing where id = ${user.user_id} `
//         const result3 = await query(stmt3)
//         const selectedToken = result3[0].token
//         //console.log(warning)
//         if (warning.token === undefined) warning.token = new Array()
//         //newWarning.push(warning)
//         if (selectedToken != null) {
//           warning.token.push(selectedToken)
//         }
//       }

//     }))

//     return warning
//     //return newWarning


//   }))

//   console.log("Finally")
//   //console.log(newWarnings)

//   return newWarnings.filter((warning) => {
//     if (warning.token !== undefined) {
//       return warning
//     }
//   })

//   //console.log(result)
//   //console.log(newWarnings)
//   // const testUser = {"District": {"沙田": 30.0, "元朗": 30.0}}

//   // for(const [key, value] of Object.entries(testUser)){
//   //   console.log('Key: ' + key + " Value: " + value)
//   //   if(typeof audience === 'string' && key.toLowerCase() == audience.toLowerCase()){
//   //     console.log("Found")
//   //   }
//   // }
//   //const tempWarning = [] 



// }

Algorithm.testingSelectUsers = async () => {
  //await selectTrafficByDistrict()

  const warningInfo = { audience: 'District', type: "region", operator: ">", marks: 10, warnings: [{ district: 13, Contents: "You are the choosen one", language: 'tc' }] }
  // const targets = await selectUserByDistrict(warningInfo)
  // //await selectTrafficByDistrict()
  // const temp = await FlowControl.limitingNotification(targets)

  // console.log(temp)

  // const final = await Promise.all(targets.map(async (target, index) => {
  //   //console.log('loop 1')
  //   //console.log(target)
  //   const message = {
  //     notification: {
  //       //title: '`Hello',
  //       body: target.Contents
  //     },
  //     //data: "Hello",
  //     data: { message: target.Contents },

  //     "android": {
  //       data: { message: target.Contents }
  //     },

  //     //https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#ApnsConfig
  //     //https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification
  //     "apns": {
  //       "payload": {
  //         aps: {
  //           'alert': {
  //             title: "Hello Apple World",
  //             body: target.Contents
  //           }
  //         }
  //       }
  //     },
  //     tokens: target.token

  //   };

  //   return message
  // }))
  // // console.log("Start notification")
  // // console.log(targets)
  // return final

}

Algorithm.processingWeatherData = async (data) => {
  const weatherRules = await selectWeatherRule()
  const testData = await selectLatestWeatherRecord()
  const warnings = await selectWarnings()
  //console.log(testData)

  //console.log(weatherRules)
  //const warnings = []

  if (!testData) throw new Error("DB Error")

  //const weatherWarnings = []
  await Promise.all(await weatherRules.map(async (rule, index) => {
    console.log('searching rules ')

    const ruleSetting = {
      ruleID: rule.id,
      audience: JSON.parse(rule.audience),
      priority: rule.priority,

    }

    console.log(ruleSetting)

    const threshold = JSON.parse(rule.threshold)
    console.log("======threshold=====")
    console.log(threshold)
    let info = {}
    //console.log(rule)
    //console.log("Checking " + rule.check_item)
    //testData.map((data) => {
    if (rule.check_item) {
      //console.log('checking: ' + rule.check_item)
      switch (rule.check_item) {
        case 'type':
        case 'subtype':
          ruleSetting['type'] = 'all'
          const newJson2 = {}
          warnings.filter((data) => {
            if (data[rule.check_item] && Helper.getEquations(data[rule.check_item], threshold.operator, threshold.mark)) {
              return true
            } else {
              return false
            }
          }).forEach((warning) => {
            if (rule.check_item && (rule.check_item == "type" || rule.check_item == "subtype") && Helper.getEquations(warning[rule.check_item], threshold.operator ?? "==", threshold.mark ?? threshold.type)) {

              const tempContent = {}

              const { multiLang, ...rest } = warning
              multiLang.split(";").forEach((data, index) => {
                if (index === 0) {
                  tempContent['alert_en'] = data + " " + rule.alert_message
                }
                if (index === 1) {
                  tempContent['alert_sc'] = data + "，" + rule.alert_message_sc
                }
                if (index === 2) {
                  tempContent['alert_tc'] = data + "，" + rule.alert_message_tc
                }
              })
              info["999"] = tempContent
              console.log(info)
            }

          })

          // info = newJson
          break;
        default:
          console.log("Default Weather")
          ruleSetting['type'] = 'region'
          const newJson = {}

          testData.filter((data, index) => {
            if (index === 0) { console.log(data); console.log(rule.check_item) }
            if (data[rule.check_item] && Helper.getEquations(data[rule.check_item], threshold.operator, threshold.mark)) {
              return true
            } else {
              return false
            }
          }).forEach((data) => {
            if (data) {
              newJson[data.DistrictID] = { alert_en: rule.alert_message, alert_sc: rule.alert_message_sc, alert_tc: rule.alert_message_tc }
            }
            //return { district: data.DistrictID, language: data.language, Contents: rule.alert_message }
          })
          console.log(newJson)
          console.log("TYPEOF NEWJSON: " + typeof newJson)
          info = newJson
          break;
      }


      if (Object.keys(info).length > 0) {
        console.log("WARNING is not null")
        ruleSetting['warnings'] = info
        await Algorithm.createNotification(ruleSetting)
      } else {
        console.log("NO NEED TO GENERATE")
      }
    } else {
      console.log("Check item not exists") //should be defined
      throw new Error("WTF")
    }

  }

  ))



}

Algorithm.processingWeatherWarning = async () => {
  const weatherRules = await selectWeatherRule()
  const warnings = await selectWarnings()

  weatherRules.forEach(async (rule, index) => {
    console.log("RULE: " + index)
    const ruleSetting = {
      ruleID: rule.id,
      audience: rule.audience,
      operator: rule.audi_operator,
      marks: rule.marks,
      priority: rule.priority,
      type: 'all'
    }
    let info = {}
    warnings.forEach((warning) => {
      if (rule.check_item && (rule.check_item == "type" || rule.check_item == "subtype") && Helper.getEquations(warning[rule.check_item], rule.type_operator, rule.type)) {

        const tempContent = {}

        const { multiLang, ...rest } = warning
        multiLang.split(";").forEach((data, index) => {
          if (index === 0) {
            tempContent['alert_en'] = data + " " + rule.alert_message
          }
          if (index === 1) {
            tempContent['alert_sc'] = data + "，" + rule.alert_message_sc
          }
          if (index === 2) {
            tempContent['alert_tc'] = data + "，" + rule.alert_message_tc
          }
        })
        info["999"] = tempContent
        console.log(info)
      }
    })

    console.log(info)
    if (Object.keys(info).length > 0) {
      ruleSetting['warning'] = info
      await Algorithm.createNotification(ruleSetting)
    }


  })

  return
  //   //console.log(warnings)
  //   ruleSetting['type'] = 'all'
  //   const notifyWarnings = warnings.filter((warning) => {

  //     console.log(rule)
  //     if (Helper.getEquations(warning[rule.check_item], rule.type_operator, rule.code)) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   }).map((warning) => {
  //     return { Contents: warning.Contents, language: warning.language }

  //   })

  //   console.log('notify')
  //   console.log(notifyWarnings)
  //   if (notifyWarnings.length !== 0) {
  //     info = notifyWarnings
  //   } else {
  //     console.log('No warning is required')
  //   }

  //   break;



}

Algorithm.processingTrafficData = async () => {
  const startTime = new Date()
  console.log("============ Start: " + startTime + " ================")

  const trafficRules = await selectTrafficRules()

  await Promise.all(trafficRules.map(async (rule, index) => {

    //if (await NC.dailyFlowControl(rule.priority) && await NC.checkRuleCoolDown(rule.id)) {
    console.log("NOW IS RULE: " + parseInt(index) + 1)

    //console.log(rule)

    const ruleSetting = {
      ruleID: rule.id,
      audience: JSON.parse(rule.audience),
      //operator: rule.audi_operator,
      //marks: rule.marks,
      priority: rule.priority,
    }
    console.log(ruleSetting)
    if (rule.check_item) {
      switch (rule.check_item) {
        case 'speed&occupancy':
          ruleSetting['type'] = 'region'
          const traffic_jam = await selectTrafficByRoad(rule.threshold)
          if (traffic_jam.length === 0) {
            break
          } else {
            console.log("Checking")
            const info = {}
            traffic_jam && traffic_jam.forEach((road) => {
              let { Road_en, Road_tc, Road_sc, district_id } = road
              Road_en = Road_en.slice(0, Road_en.lastIndexOf('-'))
              Road_sc = Road_sc.slice(0, Road_sc.lastIndexOf('-'))
              Road_tc = Road_tc.slice(0, Road_tc.lastIndexOf('-'))

              const temp = info[district_id] ?? []
              info[district_id] = [...temp, { Road_en, Road_sc, Road_tc }]
            })
            console.log(info)

            //console.log(info)
            const alert = {}
            console.log('=========================')
            info && Object.entries(info).forEach(([key, value]) => {
              let alert_en = "", alert_sc = "", alert_tc = "";
              value.forEach((road, index) => {
                console.log(road.Road_en)
                const separator = ", "
                const separator2 = "，"

                alert_en = alert_en + road.Road_en + separator
                alert_sc = alert_sc + road.Road_sc + separator2
                alert_tc = alert_tc + road.Road_tc + separator2
              })

              alert_en = " There is a gridlock on " + alert_en + rule.alert_message
              alert_sc = alert_sc + "现正交通挤塞。" + rule.alert_message_sc
              alert_tc = alert_tc + "現正交通擠塞。" + rule.alert_message_tc

              alert[key] = { alert_en, alert_sc, alert_tc }
            })
            console.log(alert)
            console.log('=========================')
            ruleSetting['warnings'] = alert
            break;

          }

        default:
          //console.log("Default")
          ruleSetting['type'] = 'region'
          const incidents = await selectSpecialTraffic(rule.type)
          //console.log("Finish")
          if (incidents.length === 0) {
            //console.log("No Result")
            break;
          } else {
            //console.log("CCC")
            const info = {}
            incidents && incidents.forEach((inc, index) => {
              if (index === 0) console.log(inc)

              const { district_id, all_contents } = inc
              console.log(district_id)
              const tempContent = {}
              //console.log('all')
              //console.log(all_contents)
              all_contents.split(";").forEach((data, index) => {
                if (index === 0) {
                  tempContent['en'] = data
                }
                if (index === 1) {
                  tempContent['sc'] = data
                }
                if (index === 2) {
                  tempContent['tc'] = data
                }

              })


              //if(index === 0) console.log(tempContent)
              const temp = info[district_id] ?? []
              info[district_id] = [...temp, tempContent]

            })

            //console.log(info)

            const alert = {}
            info && Object.entries(info).forEach(([key, value]) => {
              let alert_en = "", alert_sc = "", alert_tc = "";

              //console.log(value)
              console.log(key)

              value.forEach((inc, index) => {
                alert_en = alert_en + inc.en
                alert_sc = alert_sc + inc.sc
                alert_tc = alert_tc + inc.tc
              })

              alert[key] = { alert_en, alert_sc, alert_tc }
            })
            console.log('========Final=================')
            console.log(alert)
            ruleSetting['warnings'] = alert
            break;
          }


        //}



      }
    }
    if (ruleSetting.warnings) await Algorithm.createNotification(ruleSetting)




  }))
  const endTime = new Date()
  console.log("============ End: " + endTime + " ================")
  console.log("Total Time: " + ((endTime - startTime) / 1000) + "s")
  return
  //console.log(ruleResults)
  //return ruleResults

}

Algorithm.UserProfile = async () => {
  const stmt = `Select * from ${profile}`
  return await query(stmt)
}

Algorithm.FindUserProfileByID = async (list) => {

  const splitedList = list.join(',')
  const stmt = `Select * from ${profile}  where user_id in (${splitedList})`
  // console.log(splitedList)
  const result = await query(stmt, [splitedList])
  console.log("=======Select User By ID from Prioritized List======")
  console.log(result)
  return result
}

Algorithm.FindUserPrioritzedList = async (district_id) => {
  console.log('finding by district id ' + district_id)
  // const stmt = `Select l.user_id, l.location, p.profile from ${list} l, ${profile} p where l.user_id = p.user_id`
  // const pri_list = await query(stmt)
  // if (pri_list.length === 0) throw new Error("WTF")
  // const selectedList = []
  // pri_list.forEach((el) => {
  //   const prioritized = JSON.parse(el.location)[0]
  //   const [location, mark] = prioritized
  //   //console.log(location)
  //   if (location == district_id) {
  //     delete el.location
  //     selectedList.push(el)
  //   }
  // })
  //console.log(selectedList[0])
  //console.log(selectedList)
  //const selectedList = []

  const selectedList = []

  const stmt = `Select users from location_user where location_id = ?`
  const result = await query(stmt, [district_id])
  if (!result.length || result.length === 0) {
    console.log("No users in district " + district_id)
  } else {
    const user_list = JSON.parse(result[0].users)
    const stmt2 = `Select user_id, profile from ${profile} where user_id in (${user_list.join(',')})`
    const result2 = await query(stmt2)
    return result2

  }

}



Algorithm.SelectUserAlgorithm = async (audience, type, district_id) => {
  //const startTime = new Date()
  console.log("running algorithm, type: " + type + " id: " + district_id)
  console.log(audience)
  //console.log(startTime)
  //{ruleID: 18, audience: [{'cat':'location', "operator":">", mark:50}], operator: '>', marks: 100, priority: 2, type: 'region', warning: {'6': [Object], '7': [Object], '12': [Object], '15': [Object], '16': [Object], '17': [Object]}
  //const {value, operator, mark} = audience
  let user_list = []
  const selectedList = []
  if (type === 'region') {
    user_list = await Algorithm.FindUserPrioritzedList(district_id)
    //console.log(user_list)
  } else {
    //boardcast by tag
    user_list = await Algorithm.UserProfile();
  }
  console.log('Finish finding user profile')

  user_list.length > 0 && user_list.forEach((user, index) => {
    const flattenProfile = flattenUserProfile(JSON.parse(user.profile))
    //console.log(flattenProfile)
    // if (index === 0) console.log(flattenProfile)
    audience.forEach((item, index2) => {
      if(index2 === 0) console.log(item)
      const {category, operator, mark} = item
      if(Object.keys(flattenProfile).includes(category)){
        if(Helper.getEquations(flattenProfile[category], operator, mark)){
          selectedList.push(user.user_id)
        }else{
          console.log("Not enough score")
        }
      }else{
        console.log('Not included')
      }
    })
    
  })


    // user_list.length > 0 && user_list.forEach((user, index) => {

    // const flattenProfile = flattenUserProfile(JSON.parse(user.profile))
    // //console.log(flattenProfile)
    // if (index === 0) console.log(flattenProfile)
    // Object.entries(flattenProfile).forEach(([key, value], index) => {
    //   audience.forEach((item, index2) => {
    //     //if(index === 1) console.log(item)
    //     const { category, operator, mark } = item
    //     //console.log(category)
    //     if (key == category && Helper.getEquations(value, operator, mark) && !selectedList.includes(user.user_id)) {
    //       selectedList.push(user.user_id)
    //     }
    //   })

    //   })
    // })

    console.log(selectedList)
    return selectedList

  }

Algorithm.createNotification = async (notification) => {
      //{ruleID: 18, audience: 'location', operator: '>', marks: 100, priority: 2, type: 'region', warning: {'6': [Object], '7': [Object], '12': [Object], '15': [Object], '16': [Object], '17': [Object]}
      console.log("=====Notification=====")
      const record = "notification_log"
      console.log(notification)

      //const user_list = await Algorithm.SelectUserAlgorithm(notification) not here
      const stmt = Helper.genInsert(record, ['rule_id', 'type', 'district_id', 'location_en', 'location_sc', 'location_tc', 'content_en', 'content_sc', 'content_tc', 'isPush', 'targets', 'count'])
      const stmt2 = `Select alert_message, alert_message_tc, alert_message_sc from ${rule} where id = ?`

      const {
        warnings,
        ...rest
      } = notification
      const alertMessages = await query(stmt2, [rest.ruleID])
      if (alertMessages.length === 0) throw new Error('WTF')
      console.log("alertMessages")
      console.log(alertMessages)
      const { alert_message, alert_message_tc, alert_message_sc } = alertMessages[0]

      // console.log("================Warning====================")
      // console.log(rest.audience)

      const isPush = (rest.priority === 1) ? 0 : 1
      console.log("Start select user algorithm")


      Object.entries(warnings).map(async ([key, value], index) => {
        //18 district = loop 18 times
        console.log("============looping============")

        const user_list = await Algorithm.SelectUserAlgorithm(rest.audience, rest.type, key)
        if (user_list.length > 0) {
          await query(stmt, [rest.ruleID, rest.type, key, value.alert_en, value.alert_sc, value.alert_tc, alert_message, alert_message_sc, alert_message_tc, isPush, JSON.stringify(user_list), user_list.length])
        }
      })


      // if (user_list.length > 0) {
      //     await query(stmt, [rest.ruleID, rest.type, key, value.alert_en, value.alert_sc, value.alert_tc, isPush, user_list, user_list.length])
      // }


    }

const flattenUserProfile = (profile) => {
    let out = {};
    for (const k in profile) {
      out = { ...out, ...profile[k] };
    }
    return out;
  };


  module.exports = Algorithm