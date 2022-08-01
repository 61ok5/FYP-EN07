const PushNotification = {}
const { query } = require('../db')

const admin = require("firebase-admin");
// const google = require('google-auth-library');
const serviceAccount = require("../../serviceAccountKey.json");



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://silken-agent-325406-default-rtdb.asia-southeast1.firebasedatabase.app"
});

//PushNotification.sendNotification = async (payload, ruleID, audience, target, content) => {
PushNotification.sendNotification = async (payload) => {
    console.log("Firebase Push Notification")
    //const options = { priority: 'high', timeToLive: 60 * 60 * 12 }
    //console.log(payload)

    // const message = {
    //     notification: {
    //       title: 'Locolla',
    //       body: 'Testing Contents'
    //     },
    //     //data: "Hello",
    //     data: { message: "Testing Contents" },
  
    //     "android": {
    //       data: { message: "Testing Contents" }
    //     },
  
    //     //https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#ApnsConfig
    //     //https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification
    //     "apns": {
    //       "payload": {
    //         aps: {
    //           'alert': {
    //             title: "Locolla",
    //             body: "Custom Contents"
    //           }
    //         }
    //       }
    //     },
    //     tokens: token
  
    //   };
    // console.log("PPPPPPPPPPPPPPPP")
    //FORCE TO SEND TO TEST DEVICE

    payload.tokens = ['c0M0f73uRMGce8KKZf84m_:APA91bG9EdrydM_BDHEpdvAiDuZg_OAB4o1YA7Q87oc7Dqb6hFv85EfI_SO3rjFtFiMk1ru4UBMtECMjBzG9K9WxpUPqGl2hOF6vSbMh8rkeT8HQlbfN3aDMNNiBSRKlLhL48ZFS9puE']
    //console.log(payload.tokens)
    admin.messaging().sendMulticast(payload)
        .then(async (response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
            console.log(response)
            
            //await query(stmt, [ruleID, audience, target, content])
        })
        .catch((error) => {
            console.log('Error sending message:', error);
            console.log(error)

        });
    //})


}
module.exports = PushNotification