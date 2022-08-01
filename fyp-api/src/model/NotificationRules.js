const Rules = {};
const { query } = require('../db');
const Validate = require('../util/validate');

const parameters = 'parameters'
const priority = 'notification_priority'
const db_rules = 'notification_rules';

const jsonTryParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
};
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://silken-agent-325406-default-rtdb.asia-southeast1.firebasedatabase.app"
// });

Rules.selectAll = async () => {
  const stmt = `SELECT ${db_rules}.*, ${priority}.default_limit as per_day, ${priority}.name as priorty_name FROM ${db_rules}, ${priority} where ${db_rules}.priority = ${priority}.priority `;
  //console.log(stmt)

  return (await query(stmt)).map(el => {
    el.threshold = jsonTryParse(el.threshold);
    el.audience = jsonTryParse(el.audience)
    return el;
  });
};

Rules.findById = async (id) => {
  const stmt = `SELECT * FROM ${db_rules} WHERE id = ?`;

  let result = await query(stmt, [id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  result = result.map((el) => {
    el.threshold = jsonTryParse(el.threshold)
    el.audience = jsonTryParse(el.audience)

    return el
  })

  result = result[0]
  // result.condition = jsonTryParse(result.condition);
  // result.action = jsonTryParse(result.action);
  return result;
};


Rules.create = async (data) => {
  console.log(data)
  let { ...rest } = data;
  const stmt2 = `Select label, unit from ${parameters} where value = ?`

  //const { ...label, unit } = result[0]

  let audi_display = rest.audience.map((tag) => {
    console.log(tag)
    return tag.category + " " + tag.operator + " " + tag.mark
  })
  console.log(audi_display)
  audi_display = audi_display.join(", ")

  let type_display = "";
  if (rest.threshold.type == 'traffic_jam') {
    Object.entries(threshold).forEach(([key, value]) => {
      if (key === 'speed') {
        type_display = type_display + key + " < " + value + "km/h, "
      } else if (key === 'occupancy') {
        type_display = type_display + key + " > " + value + "%"
      }
    });
  } else {
    const result = await query(stmt2, rest.threshold.type)
    const { label, unit } = result[0]
    type_display = `${label} ${(rest.threshold.operator) ?? ""} ${rest.threshold.mark ?? ""} ${unit ?? ""}`
    //type_display = label +  (type_operator)?" "+type_operator:"" + threshold ? " "+ threshold:"" + unit?unit:""
  }


  //const type_display = (type !== 'traffic_jam') ? result[0].label + (type_operator && type_operator != "==" ? type_operator : "") + (threshold && threshold != type ? threshold : "") + (result[0].unit ? result[0].label : "") : temp

  const stmt = `INSERT INTO ${db_rules} (rule_name, notification_type, audience, audi_display, type, threshold, type_display, priority, alert_message, alert_message_sc, alert_message_tc) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  //console.log(stmt)
  return await query(stmt, [rest.rule_name, rest.notification_type, Validate.toStringifyJson(rest.audience), audi_display, rest.threshold.type, Validate.toStringifyJson(rest.threshold), type_display, rest.priority, rest.alert_message, rest.alert_message_sc, rest.alert_message_tc]);
};

Rules.update = async (data) => {

  let { ...rest } = data;
  const stmt2 = `Select label, unit from ${parameters} where value = ?`

  //const { ...label, unit } = result[0]

  let audi_display = rest.audience.map((tag) => {
    return tag.category + " " + tag.operator + " " + tag.mark
  })
  audi_display = audi_display.join(", ")

  let type_display = "";
  if (rest.threshold.type == 'traffic_jam') {
    Object.entries(rest.threshold).forEach(([key, value]) => {
      if (key === 'speed') {
        type_display = type_display + key + " < " + value + "km/h, "
      } else if (key === 'occupancy') {
        type_display = type_display + key + " > " + value + "%"
      }
    });
  } else {
    const result = await query(stmt2, rest.threshold.type)
    const { label, unit } = result[0]
    type_display = `${label} ${(rest.threshold.operator) ?? ""} ${rest.threshold.mark ?? ""} ${unit ?? ""}`
    //type_display = label +  (type_operator)?" "+type_operator:"" + threshold ? " "+ threshold:"" + unit?unit:""
  }


  const stmt = `UPDATE ${db_rules} SET rule_name = ?, notification_type = ? , audience = ?, audi_display = ?, type = ?,  threshold = ?, type_display = ?,  priority = ?, alert_message = ?, alert_message_sc = ?, alert_message_tc = ? WHERE id = ?`;
  return await query(stmt, [rest.rule_name, rest.notification_type, Validate.toStringifyJson(rest.audience), audi_display, rest.threshold.type, Validate.toStringifyJson(rest.threshold), type_display, rest.priority, rest.alert_message, rest.alert_message_sc, rest.alert_message_tc, rest.id]);
};

Rules.delete = async (id) => {
  const stmt = `DELETE FROM ${db_rules} WHERE id = ?`;
  return await query(stmt, id);
};

Rules.getParameters = async () => {
  const stmt = `Select * from ${parameters}`
  return await query(stmt)
}

Rules.getPriority = async () => {
  const stmt = `Select * from ${priority} order by priority`
  return (await query(stmt)).map((pri) => {
    return pri
  })
}

// Rules.sendNotification = async (payload) => {

//   //const firebaseToken = await getAccessToken()

//   //getting the FCM Token from the db
//   console.log('handling')




//   const options = { priority: 'high', timeToLive: 60 * 60 * 12 }

//   // the payload is required to handle for different platforms

//   admin.messaging().sendMulticast(payload)
//     .then((response) => {
//       // Response is a message ID string.
//       console.log('Successfully sent message:', response);
//       console.log(response.responses)
//     })
//     .catch((error) => {
//       console.log('Error sending message:', error);
//       console.log(error)

//     });

// }


module.exports = Rules;
