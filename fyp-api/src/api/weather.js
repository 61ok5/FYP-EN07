const express = require('express');
const router = express.Router();

const Weather = require('../model/Weather');

router.get('/weather_daily_forecast_log/:language', async (req, res) => {
  try {
    const {
      language
    } = req.params;
    const result = await Weather.selectDaily(language);
    console.log("Here is api class: ", result);
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/warning_log/:language', async (req, res) => {
  try {
    const {
      language
    } = req.params;
    const result = await Weather.selectWarning(language);
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/weather_hourly_log', async (req, res) => {
  try {
    const {
      lat,
      lon
    } = req.query;
    const result = await Weather.selectHourly(lat, lon);
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;