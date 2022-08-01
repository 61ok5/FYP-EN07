const express = require('express');
const router = express.Router();
const Health = require('../model/Health');

router.get('/calorie', async (req, res) => {
    try {
        const {
            weight,
            id
        } = req.query;
        const result = await Health.selectHealth(weight, id);
        res.json(result);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;