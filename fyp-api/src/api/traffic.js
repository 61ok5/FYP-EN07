const express = require('express');
const router = express.Router();

const Traffic = require('../model/Traffic');

//Get leatest api_code info
router.get('/roadwork/:language', async (req, res) => {
  try {
    const {
      language
    } = req.params;
    const result = await Traffic.selectRoadWorks(language);
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/special_traffic_news/:language', async (req, res) => {
    try {
      const {
        language
      } = req.params;
      const result = await Traffic.selectSpecialTraffic(language);
      res.json(result);
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/journey_time/:language', async (req, res) => {
    try {
      const {
        language
      } = req.params;
      const result = await Traffic.selectJourney(language);
      res.json(result);
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
  });
  
module.exports = router;