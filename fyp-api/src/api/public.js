const express = require('express');
const router = express.Router();
const Public = require('../model/Public');

router.get('/district', async (req, res) => {
    try {
        const result = await Public.selectDistrict();
        res.json(result);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

router.get('/:api_code', async (req, res) => {
    try {
        const {
            api_code
        } = req.params;
        const result = await Public.selectAPI(api_code);
        res.json(result);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});
module.exports = router;