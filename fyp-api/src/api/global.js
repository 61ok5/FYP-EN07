const express = require('express');
const router = express.Router();
const Permissions = require('../util/permission');

const Global = require('../model/Global');
const { request } = require('https');
const { isNull } = require('util');

router.get('/info/all', async (req, res) => {
    //const isAdmin = Permissions.isAdmin(req.user);
    //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });
  
    try {
      const result = await Global.selectAll();
      res.json(result);
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
});

router.get('/info/:id', async (req, res) => {
    //const isAdmin = Permissions.isAdmin(req.user);
    //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });
  
    try {
      // will throw error if undefined
      const {
        id
      } = req.params;
  
      const result = await Global.findById(id);
      if (!result) throw new Error('GLOBAL_SETTING_NOT_FOUND');
  
      res.json(result);
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
});

router.post('/updateSetting/', async (req, res) => {
    try {
      const {
        id, name, value, description
      } = req.body;
      
      try {
        const result = await Category.updateCategory(id, name, value, description);
        res.json({
          status: 'ok'
        });
      }
      catch (err) {
        throw new Error('GLOBAL_SETTING_NOT_FOUND');
      }
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ error: err.message });
    }
});