const express = require('express');
const router = express.Router();

const Permissions = require('../util/permission');
const Rules = require('../model/Rules');

// list
router.get('/', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    res.status(200).json(await Rules.selectAll());
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

    res.status(200).json(await Rules.findById(req.params.id));
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

    res.status(200).json(await Rules.create(req.body.data));
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

// update
router.post('/update', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);

    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });
    if ('data' in req.body === false) return res.status(400).json({ error: 'BAD_REQUEST' });

    res.status(200).json(await Rules.update(req.body.data));
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

    res.status(200).json(await Rules.delete(req.params.id));
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

module.exports = router;
