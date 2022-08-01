const Notifier = {};

const admin = require("firebase-admin");
// const google = require('google-auth-library');
const serviceAccount = require("../../serviceAccountKey.json");




Notifier.sendNotification = async (payload) => {

    //const firebaseToken = await getAccessToken()

    //getting the FCM Token from the db
    console.log('handling')


    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://silken-agent-325406-default-rtdb.asia-southeast1.firebasedatabase.app"
    });

    const options = { priority: 'high', timeToLive: 60 * 60 * 12 }

    // the payload is required to handle for different platforms

    admin.messaging().sendMulticast(payload)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });

    return null
}

// function getAccessToken() {
//     return new Promise(function (resolve, reject) {
//         const key = serviceAccount
//         const jwtClient = new google.auth.JWT(
//             key.client_email,
//             null,
//             key.private_key,
//             SCOPES,
//             null
//         );
//         jwtClient.authorize(function (err, tokens) {
//             if (err) {
//                 reject(err);
//                 return;
//             }
//             resolve(tokens.access_token);
//         });
//     });
// }


module.export = Notifier


