const express = require('express');
const router = express.Router();

const Permissions = require('../util/permission');
const NC = require('../model/NotificationCenter');
const Algorithm = require('../model/NotificationAlgorithm');
const cron = require('node-cron');
const Time = require('../util/time');
const PushNotification = require('../model/PushNotification');

// cron.schedule('*/5 * * * *', async () => {
//     try {
//         console.log(Time.convertDateTime2(new Date()))
//         console.log("Searching Notification")
//         await NC.NotificationCenter()
//     } catch (error) {
//         console.log(error)
//     }
// });

// cron.schedule('*/15 * * * *', async () => {
//     try {
//         console.log(Time.convertDateTime2(new Date()))
//         console.log("Running Algorithm")
//         await Algorithm.processingTrafficData()
//         await Algorithm.processingWeatherData()
//         // await Algorithm.processingWeatherWarning()
//     } catch (error) {
//         console.log(error)
//     }

// })


router.get('/all', async (req, res) => {
    try {
        const isAllowed = Permissions.isAdmin(req.user);
        if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

        const result = await NC.findNonPushNotification()
        res.json(result)

    } catch (err) {
        res.status(500).json({ err })
    }

})

router.post('/history', async (req, res) => {
    try {
        const isAllowed = Permissions.isAdmin(req.user);

    } catch (error) {

    }
})

router.post('/noti/push', async (req, res) => {
    try {
        const isAllowed = Permissions.isAdmin(req.user);
        let { log_list, content_sc, content_tc, content_en } = req.body

        //await NC.upda
        await NC.updateNotificationContents(log_list, { content_en, content_sc, content_tc })
        //await NC.updatePushStatus(id, 1)
        //await PushNotification.sendNotification()
        res.json({ status: "success" })

    } catch (error) {
        res.status(500).json({ error: error })

    }


})

router.post('/noti/delete', async (req, res) => {
    try {
        const isAllowed = Permissions.isAdmin(req.user);
        console.log(req.body)
        const { id } = req.body

        await NC.deleteNotification(id)

        res.json({ status: "success" })

    } catch (error) {
        res.status(500).json(error)
    }
})

router.post('/test/NC', async (req, res) => {
    try {
        const start = new Date()
        console.log(start)
        await NC.NotificationCenter()
        const end = new Date()
        console.log(end)

        const result = end.getTime() - start.getTime() / 1000
        console.log(result + "S")
        res.json({ "": "" })
    } catch (err) {
        res.json({ err: err })
    }
})

router.post('/push', async (req, res) => {
    try {
        await PushNotification.sendNotification()
        res.json({ sss: "success" })

    } catch (error) {
        res.status(500).json(error)
    }
})

router.post('/register', async (req, res) => {
    try {
        console.log("REGISTER==================================")

        console.log(req.body)
        res.json({ message: "?????????" })

    } catch (error) {
        res.status(500).json({ error: err.message })

    }


})

module.exports = router