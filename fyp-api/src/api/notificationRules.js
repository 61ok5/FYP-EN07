const express = require('express');
const router = express.Router();

const Permissions = require('../util/permission');
const Rules = require('../model/NotificationRules');
const Algorithm = require('../model/NotificationAlgorithm');
const PushNotification = require('../model/PushNotification');
const NC = require('../model/NotificationCenter');

// list
router.get('/', async (req, res) => {
  try {


    console.log(req.user)
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const result = await Rules.selectAll();

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

// get by id
router.get('/find/:id', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user) || Permissions.isEndUser(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const result = await Rules.findById(req.params.id);

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});



// create
router.post('/create', async (req, res) => {
  try {


    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });
    if ('data' in req.body === false) return res.status(400).json({ error: 'BAD_REQUEST' });
    let newData = { ...req.body.data }
    Object.entries(newData).forEach(([key, value]) => {
      if (value == 'N/A') newData[key] = null
    })
    //console.log(newData)
    await Rules.create(newData);

    res.status(200).json('OK');
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

// update
router.post('/update', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    console.log(req.body)

    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });
    if ('data' in req.body === false) return res.status(400).json({ error: 'BAD_REQUEST' });

    let newData = { ...req.body.data }
    Object.entries(newData).forEach(([key, value]) => {
      if (value == 'N/A') newData[key] = null
    })

    await Rules.update(newData);
    res.status(200).json('OK');

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

// delete
router.post('/delete/:id', async (req, res) => {
  //console.log(req.params)

  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    await Rules.delete(req.params.id);

    res.status(200).json('OK');
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

router.post('/testing/finding', async (req, res) => {
    try{

      const start = new Date()
      console.log(start)


      await NC.findUserToPush()













      const end = new Date()
      console.log(end)

    }catch(err){

    }
})

//call every 15 mins after cron job get gov api
router.post('/checking/traffic', async (req, res) => {

  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    //console.log(req.body)
    console.log("Start Promise")
    const result = await Algorithm.processingTrafficData()
    //console.log(result)

    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }


})

//call once an hour
router.post('/checking/weather', async (req, res) => {

  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    //console.log(req.body)
    console.log("Start Promise")
    const result = await Algorithm.processingWeatherData()
    //console.log(result)

    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})

//call every 15 mins after cron job get gov api
router.post('/checking/weather_warning', async (req, res) => {

  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    //console.log(req.body)
    console.log("Start Promise")
    const result = await Algorithm.processingWeatherWarning()
    //console.log(result)

    res.json({})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }


})


router.post('/selecting', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const final = await Algorithm.testingSelectUsers()

    res.json({ "": "success" })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})

router.post("/notify", async (req, res) => {
  try {
    console.log('preparing')
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const token = ['fhFmuZPjTL2mOCI5Ola5JR:APA91bHiKD_w9LuD8AfKJecdaXefas8Ay6_UxuMLSJt0N5pt_s7Ew3Fj9kRTNbxCIp09NyG_3SzV5suPNHaUHRAtl8ltOV8h67fKOiJM7I03a0nCj5hOCddRo1y52ctCILZjWof3PNUg',
      "fCW0pWOtUkljmjg9d6kGRR:APA91bFGpQk0OsnZndz7dYPckizPiHZ3W6z_Kw4BBWJ980k3hTEYweXiq0WuAJxhyMpqGwsXMG6ajmAAu62LXghsjgj54EYgTPc9G6cHI2v8djwJ79mL38JywoLHXO0CqG2iICUoc-88"]

    //https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidConfig
    const message = {
      notification: {
        title: 'Locolla',
      },
      //data: "Hello",
      data: { message: "Testing Contents" },

      "android": {
        notification: {
          body: 'XXX',
          imageUrl: 'https://portal.staging.ce63-2020.shared-use.bike/Banner.jpeg'

        },
        data: { message: "Testing Contents" }
      },

      //https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#ApnsConfig
      //https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification
      "apns": {
        "payload": {
          aps: {
            'alert': {
              title: "Locolla",
              body: "Custom Contents"
            }
          }
        },
        fcm_options: {
          image: 'https://portal.staging.ce63-2020.shared-use.bike/Banner.jpeg'
        }
      },
      tokens: ['']

    };

    await PushNotification.sendNotification(message)
    res.json({ send: "success" })

  } catch (err) {

    console.log(err)
    res.status(500).json(err)
  }
})

router.post('/checking/:type', async (req, res) => {
  try {
    res.json({ message: "Received, but not yet implemented" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})





router.get('/parameters', async (req, res) => {
  try {

    console.log('welcome')
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });
    const parameters = await Rules.getParameters()
    const priority = await Rules.getPriority()

    const json = {}


    parameters.forEach((param) => {
      if (json[param.type] === undefined) {
        json[param.type] = new Object()
      }

      json[param.type][param.value] = param
      //json[param.type].push(param)
    })

    priority.forEach((pri) => {
      if (json['priority'] === undefined) {
        json['priority'] = new Object()
      }
      console.log(typeof pri.priority)
      json['priority'][pri.priority] = pri
    })

    res.json(json)



  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err })
  }
})


module.exports = router;
