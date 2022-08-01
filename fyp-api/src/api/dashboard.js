const express = require('express');
const router = express.Router();
const time = require('../util/time');

const Permissions = require('../util/permission');
const Dashboard = require('../model/Dashboard');

// list
router.get('/', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const result = await Dashboard.selectAll();

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

// get by date
router.get('/:date', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const result = await Dashboard.findByDate(time.convertDate(req.params.date));

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

module.exports = router;
