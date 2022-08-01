const NC = {}
const {
    query,
    locolla_query
} = require('../db');
const Helper = require('../util/helper');
const Time = require('../util/time');

const Validate = require('../util/validate');
const Algorithm = require('./NotificationAlgorithm');
const Push = require('./PushNotification')

const record = "notification_log"
const rules = "notification_rules"
const priority = "notification_priority"
const district = "district"
const list = "location_prioritized_list"
const profile = "user_profile"


const jsonTryParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
};

// NC.createNotification = async (notification) => {
//     //{ruleID: 18, audience: 'location', operator: '>', marks: 100, priority: 2, type: 'region', warning: {'6': [Object], '7': [Object], '12': [Object], '15': [Object], '16': [Object], '17': [Object]}
//     console.log("=====Notification=====")
//     //const user_list = await Algorithm.SelectUserAlgorithm(notification) not here
//     const stmt = Helper.genInsert(record, ['rule_id', 'type', 'district_id', 'content_en', 'content_sc', 'content_tc', 'isPush', 'targets', 'count'])

//     const {
//         warnings,
//         ...rest
//     } = notification
//     const isPush = (rest.priority === 1) ? 0 : 1

//     return (
//         Object.entries(warnings).forEach(async ([key, value]) => {
//             console.log("============looping============")
//             const user_list = await NC.SelectUserAlgorithm(rest.audience, rest.type, key)
//             // if (user_list.length > 0) {
//             //     await query(stmt, [rest.ruleID, rest.type, key, value.alert_en, value.alert_sc, value.alert_tc, isPush, user_list, user_list.length])
//             // }
//         }))

// }

NC.deleteNotification = async (id) => {
    const stmt = `Delete from ${record} where id in (${id}) `
    return await query(stmt, [id])

}

NC.updatePushStatus = async (id, status) => {
    const stmt = `Update ${record} Set isPush = ${status} where id = ${id}`
    console.log(stmt)
    console.log('id: ' + id + " Status: " + status)
    console.log(typeof id + ":" + typeof status)
    const result = await query(stmt)
    //console.log(result)
    return result
}

NC.selectWaitingNotification = async () => {
    const stmt = `Select * from ${record} where isPush = 1 AND Date(created_at) = Date(NOW())`
    return await query(stmt)
}

NC.updateNotificationContents = async (id, contents) => {
    const stmt = `Update ${record} Set isPush = 1, content_en = ?, content_sc = ?, content_tc = ? where id in (${id}) `
    return await query(stmt, [contents.content_en, contents.content_sc, contents.content_tc, id])
}

// NC.testFindingUser = async()=>{
//     const startTime = new Date()
//     const user_list = await NC.findUserToPush()
//     console.log(user_list.length)
//     const findingList = []
//     user_list.forEach((el)=>{
//         const target = el.location
//         const [dis_id, score] = target[0]
//         if(dis_id == 1 && score > 20){
//             findingList.push(el.user_id)
//         }
//     })
//     const endTime = new Date()
//     console.log((endTime - startTime)/1000)
//     return findingList
// }

NC.pushNotificationByID = async (id) => {
    try {
        console.log("Starting process to push")
        const notification = await NC.findNotificationByID(id)
        const user_list = JSON.parse(notification.targets)
        //console.log(users[0])
        console.log(notification)
        if (notification.length > 0) {
            const tokenResult = await NC.findTokenInList(user_list)

            tokenResult.forEach(async (el) => {
                //console.log(el)
                // let lang = el.lang
                // console.log(lang)

                //if (lang == null) lang = 'tc'
                //console.log("!!!!!!!!!!!!!!!!!!!!!!!!")
                //console.log(lang)
                const messages = await NC.generateMessage(notification, lang, el.token)
                //console.log(message)

                messages.forEach(async (message) => {
                    await Push.sendNotification(message)
                })

                //await Push.sendNotification(message)
            })

            await NC.updatePushStatus(id, 2)
        } else {
            console.log('send to fake users account')
            const token = ["c7Zl_E_RTsO36z1s5DGp_r:APA91bGE7ffBp-xP6AHut-rI0KcAp6ix3gDPQMEVonGP1Hcswz-CD1hiQQdio4M-NFSTEdwmsissE0rOaNy8BG8TdY40nLikbEz4_zdmEmNsbSIAsSuyFlLw3DMb0uGiarHWaOgwvBLh", "fCW0pWOtUkljmjg9d6kGRR:APA91bFGpQk0OsnZndz7dYPckizPiHZ3W6z_Kw4BBWJ980k3hTEYweXiq0WuAJxhyMpqGwsXMG6ajmAAu62LXghsjgj54EYgTPc9G6cHI2v8djwJ79mL38JywoLHXO0CqG2iICUoc-88"]
            const testMessage = await NC.generateMessage(notification, 'tc', token)
            console.log(testMessage)
            await Push.sendNotification(testMessage)
            await NC.updatePushStatus(id, 2)

        }
    } catch (err) {
        console.log(err)
        await NC.updatePushStatus(id, 3)

    }






}

NC.findNotificationByID = async (id) => {
    const stmt = `Select log.* from ${record} log where log.id = ?`
    const dataList = await query(stmt, [id])

    if (dataList.length > 1) throw new Error("WTF")
    let result = dataList[0]
    return result
}

NC.findNotificationGroupByRuleID = async (rule_id) => {
    const stmt = `Select GROUP_CONCAT(log.id SEPARATOR ";") as list, r.rule_name from ${record} log, ${rules} r where r.id = log.rule_id AND log.rule_id = ? AND isPush = 1`
    const result = await query(stmt, [rule_id])
    return result
}

// NC.findLatestNotification = async () => {
//     const stmt = `Select * from ${record} where created_at > DateSub(NOW(), INTERVAL 12 HOUR)`
//     const dataList = await query(stmt)
//     return dataList
// }

NC.findNonPushNotification = async () => {
    const stmt = `Select GROUP_CONCAT(log.id SEPARATOR ",") as log_list, GROUP_CONCAT(d.name_tc SEPARATOR ",") as region, isPush as status, log.created_at, SUM(log.count) as total, r.rule_name, p.name as "mode", log.content_en, log.content_tc, log.content_sc from ${record} log, ${rules} r, ${priority} p, ${district} d where log.rule_id = r.id and p.id = r.priority AND d.id = log.district_id AND log.isPush in (0,1) and log.created_at > Date_Sub(NOW(), INTERVAL 12 HOUR) GROUP BY r.id, HOUR(log.created_at), ROUND(MINUTE(log.created_at)/5);`
    const dataList = await query(stmt)

    //console.log(typeof dataList[0].log_list)
    return dataList.map((el) => {
        el.created_at = Time.convertDateTime2(el.created_at)
        return el
    })
}

//set priority emegerency required to manual push 
// NC.findEmergencyNotification = async () => {
//     const stmt = `Select l.id, d.name_en as district, r.rule_name, l.created_at, l.content_en, l.content_sc, l.content_tc, l.isPush as status from ${record} l, ${rules} r, ${priority} p, ${district} d where l.rule_id = r.id and r.priority = p.id and p.id = 1 and l.district_id = d.id and l.isPush != 3 AND Date(l.created_at) = Date(NOW());`
//     const dataList = await query(stmt)
//     const result = dataList.map((data) => {
//         data.created_at = Time.convertDateTime2(data.created_at)
//         return data
//     })
//     return result
// }

NC.findNotificationCenter = async () => {
    const list = await NC.findNotificationToPush()
}


NC.findUserToPush = async () => {
    const stmt = `Select * from ${list}`
    const dataList = await query(stmt)
    const result = dataList.map((el) => {
        el.location = JSON.parse(el.location)
        return el
    })
    return result
}

NC.findTokenInList = async (list) => {
    //console.log(list)
    const temp = list.join(",")
    //console.log(temp)
    const stmt = `Select lang, group_concat(fcm_token SEPARATOR ";") as token from ${profile} where user_id in (${temp}) group by lang`
    const dataList = await query(stmt)
    //console.log(dataList)
    const sliceMap = []

    dataList.filter(el => {
        if (el.token) return el
    }).forEach((el) => {
        let temp = el.token.split(";")
        el.lang = (el.lang == null) ? 'tc' : el.lang
        //el.token = temp
        temp.forEach((tk, index) => {
            if (index % 500 === 0) {
                sliceMap.push({ lang: el.lang, token: temp.slice(index, index + 499) })
            }
        })
    })
    // result.forEach((el, index) => {
    //     el.token.forEach((tk, index) => {
    //         if (index % 500 === 0) {
    //             if (index > 0) console.log("========Splited==========")
    //             sliceMap.push({ lang: el.lang, token: el.token.slice(index, index + 499) })
    //         }
    //     })
    // })
    console.log("Splited token list")
    console.log(result)
    return sliceMap

}

NC.generateMessage = async (no, lang, token) => {
    //console.log(lang)
    console.log("=======================LANG===============================")
    const content = no["content_" + lang]
    const location = no['location_' + lang]

    const text = location + content ?? ""

    const message = {
        notification: {
            title: 'Locolla',
            body: text
        },
        //data: "Hello",
        data: {
            message: text
        },

        "android": {
            notification: {
                title: "Locolife",
                body: text,
                imageUrl: 'https://portal.staging.ce63-2020.shared-use.bike/Banner.jpeg'
            },
            data: {
                //custom json
                message: text
            }
        },

        //https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#ApnsConfig
        //https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification
        "apns": {
            "payload": {
                aps: {
                    'alert': {
                        title: "Locolife",
                        body: text
                    }
                }
            },
            fcm_options: {
                image: 'https://portal.staging.ce63-2020.shared-use.bike/Banner.jpeg'
            }
        },
        tokens: token

    };
    console.log("finish generate")
    return message


    // const message = {
    //     notification: {
    //         body: {
    //             message: content
    //         }
    //     },
    //     data: {
    //         message: content
    //     },
    //     "android": {
    //         data: {
    //             message: content
    //         }
    //     },
    //     apns: {
    //         "payload": {
    //             aps: {
    //                 'alert': {
    //                     body: content
    //                 }
    //             }
    //         }
    //     },
    //     tokens: token

    // }


}

NC.dailyFlowControl = async (priority) => {
    if (priority == 2) {
        const stmt = `Select l.rule_id, p.name, count(*) as count from 
        (Select * from notification_log where isPush = 0 and DATE(created_at) = DATE(NOW()) group by rule_id, updated_at) l,
         notification_rules r, notification_priority p WHERE r.id = l.rule_id AND r.priority = p.id AND p.id = 2 group by p.id;`
        const dataList = await query(stmt)
        if (dataList.length > 1) throw new Error("WTF")
        if (dataList.length === 1) {
            const result = dataList[0]
            if (result.count > 5) {
                return false
            } else {
                return true
            }
        } else {
            return true
        }
    } else {
        return true
    }
}

NC.checkRuleCoolDown = async (rule_id) => {
    const stmt = `Select id from ${record} where created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR) AND rule_id = ?`
    const dataList = await query(stmt, [rule_id])
    console.log(dataList.length)
    if (dataList.length > 0) {
        console.log("Still waiting for cooldown")
        return false
    } else {
        return true
    }

}

NC.findNotificationToPush = async () => {
    const stmt = `Select GROUP_CONCAT(l.id SEPARATOR ";") as id_list from ${record} l, ${rules} r 
    where isPush in (1) and r.priority = 1 
    and r.id = l.rule_id group by r.id order by l.id;`
    return await query(stmt)
}

NC.NotificationCenter = async () => {
    const toPush = await NC.findNotificationToPush()
    console.log(toPush)
    toPush.forEach(async (no) => {
        no.id_list.split(";").forEach(async (id) => {
            //console.log(id)
            await NC.pushNotificationByID(id)
        })
    })

    //await NC.cancelRemainingNotification()
}

NC.cancelRemainingNotification = async () => {
    const stmt = `Update ${record} l INNER JOIN ${rules} r on r.id = l.rule_id Set isPush = 3 where r.priority != 1 and l.isPush = 1`
    return await query(stmt)

}



module.exports = NC