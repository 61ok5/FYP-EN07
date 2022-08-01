/* eslint-disable max-len */
const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');

const Role = require('../model/Role');

router.use(middlewares.adminOnly);

router.get('/all', async (req, res) => {
  const roles = await Role.selectAll();

  let result = JSON.parse(JSON.stringify(roles));
  res.json(result);
});

router.get('/permitted', async (req, res) => {
  try {
    const userRole = await Role.findById(req.user.role_id);
    if (!userRole) throw new Error('INVALID_TOKEN');

    let roles;
    if (req.user.is_superadmin) {
      roles = await Role.selectAll();
    } else {
      roles = await Role.selectPermittedByLevel(userRole.level);
    }

    let result = JSON.parse(JSON.stringify(roles));
    if (!result) throw new Error('DATABASE_ERROR');
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
