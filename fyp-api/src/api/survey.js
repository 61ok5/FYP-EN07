const express = require('express');
const router = express.Router();

const Permissions = require('../util/permission');
const SurveyTemplate = require('../model/SurveyTemplate');

// list
router.get('/', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const result = await SurveyTemplate.selectAll();

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred'});
  }
});

// get by id
router.get('/:id', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user) || Permissions.isEndUser(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    const result = await SurveyTemplate.findById(req.params.id);

    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred'});
  }
});

// create
router.post('/', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    if ('data' in req.body === false) return res.status(400).json({ error: 'BAD_REQUEST' });

    await SurveyTemplate.create(req.body.data);

    res.status(200).json('OK');
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred'});
  }
});

// update
router.put('/:id', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    if ('data' in req.body === false) return res.status(400).json({ error: 'BAD_REQUEST' });

    await SurveyTemplate.update(req.params.id, req.body.data);

    res.status(200).json('OK');
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred'});
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const isAllowed = Permissions.isAdmin(req.user);
    if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });

    await SurveyTemplate.delete(req.params.id);

    res.status(200).json('OK');
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred'});
  }
});

module.exports = router;
