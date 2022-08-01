const express = require('express');
const router = express.Router();
const Permissions = require('../util/permission');

const Category_group = require('../model/Category_group');
const Category = require('../model/Category');

//get all groups info
router.get('/info/all', async (req, res) => {
  //const isAdmin = Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const result = await Category_group.selectAll();

    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//get group info by group_id
router.get('/info/:id', async (req, res) => {
  //const isAdmin = Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    // will throw error if undefined
    const {
      id
    } = req.params;

    const result = await Category_group.findById(id);
    if (!result) throw new Error('GROUP_NOT_FOUND');

    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//add group
router.post('/addGroup', async (req, res) => {
  //const isAdmin = Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const {
      Name
    } = req.body;
    
    const result = await Category_group.addGroup(Name);
    //how to reject duplicate group_name??? Error('group name already exists')
    if (!result) throw new Error('DATABASE_ERROR');
    res.json({
        status: 'ok'
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//delete group
router.post('/deleteGroup/', async (req, res) => {
  //const isAdmin = Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    // will throw error if undefined
    const {
      id
    } = req.body;

    const result = await Category_group.deleteById(id);
    if (!result) throw new Error('GROUP_NOT_FOUND');

    res.json({
      status: 'ok'
  });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//update group
router.post('/updateGroup', async (req, res) => {
  try {
    const {
      id, Name
    } = req.body;
    const result = await Category_group.updateGroup(id, Name);
    if (!result) throw new Error('GROUP_NOT_FOUND');

    res.json({
      status: 'ok'
  });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;