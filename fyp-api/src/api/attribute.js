const express = require('express');
const router = express.Router();
const Helper = require('../util/helper');

const Permissions = require('../util/permission');
const Attribute = require('../model/Attribute');

// list
router.get('/', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    res.status(200).json(await Attribute.selectAll());
  } catch (err) {
    res.status(500).json({ error: 'Error occurred' });
  }
});

router.get('/nonscalar', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    res.status(200).json(await Attribute.selectAllNonScalar());
  } catch (err) {
    res.status(500).json({ error: 'Error occurred' });
  }
});

// get by id
router.get('/:id', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    res.status(200).json(await Attribute.findById(req.params.id));
  } catch (err) {
    res.status(500).json({ error: 'Error occurred' });
  }
});

// create
router.post('/create', async (req, res) => {
  try {
    const {options} = req.body;

    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });
    if (options && typeof Helper.jsonTryParse(options) !== 'object') return res.status(400).json({ error: 'INVALID_OPTIONS_JSON' });

    res.status(200).json(await Attribute.create(req.body));
  } catch (err) {
    res.status(500).json({ error: 'Error occurred' });
  }
});

// update
router.post('/update', async (req, res) => {
  try {
    const {options} = req.body;

    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });
    if (options && typeof Helper.jsonTryParse(options) !== 'object') return res.status(400).json({ error: 'INVALID_OPTIONS_JSON' });

    res.status(200).json(await Attribute.update(req.body));
  } catch (err) {
    res.status(500).json({ error: 'Error occurred' });
  }
});

// delete
router.post('/delete/:id', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    res.status(200).json(await Attribute.delete(req.params.id));
  } catch (err) {
    res.status(500).json({ error: 'Error occurred' });
  }
});

module.exports = router;
