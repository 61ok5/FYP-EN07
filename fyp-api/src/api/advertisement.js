const express = require('express');
const router = express.Router();
const Helper = require('../util/helper');

const Permissions = require('../util/permission');
const Advertisement = require('../model/Advertisement');

// list
router.get('/', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const result = await Advertisement.selectAll();

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

// get by id
router.get('/:id', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user) || Permissions.isEndUser(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const result = await Advertisement.findById(req.params.id);

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

// create
router.post('/create', async (req, res) => {
  try {
    const {noti_condition} = req.body;
    
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });
    if (noti_condition && typeof Helper.jsonTryParse(noti_condition) !== 'object') return res.status(400).json({ error: 'INVALID_CONDITION_JSON' });

    res.status(200).json(await Advertisement.create(req.body));
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

// update
router.post('/update', async (req, res) => {
  try {
    const {noti_condition} = req.body;

    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });
    if (noti_condition != undefined && typeof Helper.jsonTryParse(noti_condition) !== 'object') return res.status(400).json({ error: 'INVALID_CONDITION_JSON' });

    res.status(200).json(await Advertisement.update(req.body));

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

// delete
router.post('/delete/:id', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    await Advertisement.delete(req.params.id);

    res.status(200).json('OK');
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

module.exports = router;
