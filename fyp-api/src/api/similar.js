const express = require('express');
const router = express.Router();
const Helper = require('../util/helper');

const Permissions = require('../util/permission');
const Similar= require('../model/Similar');


  // get by type and id
router.get('/:type/:id', async (req, res) => {
  try {
  //   const isAllowed = Permissions.isAdmin(req.user) || Permissions.isEndUser(req.user);
  //   if (!isAllowed) return res.status(401).json({ error: 'PERMISSION_DENIED' });
    const {type , id} = req.params;

    switch(type){
      case 'activity':
        res.status(200).json(await Similar.findActById(id));
        break;
      case 'product':
        res.status(200).json(await Similar.findProById(id));
        break;
      case 'article':
        res.status(200).json(await Similar.findArtById(id));
        break;
      default:
        res.status(400).json({ error: "invalid type" });
    }

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: 'Error occurred' });
  }
});

  module.exports = router;