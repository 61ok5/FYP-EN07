const express = require('express');
const router = express.Router();
const Permissions = require('../util/permission');

const Product = require('../model/Product');

//get all products info
router.get('/info/all', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const result = await Product.selectAll();
    result.map((data)=>{
      data.category = JSON.parse(data.category.replace(/"/gi, '"'))
      data.tags = Object.keys(data.category)
    })
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/info/displayed/:pageNumber', async (req, res) => {

  try {
    const result = await Product.selectDisplayed(req.params.pageNumber);
    // result.map((data)=>{
    //   data.category = JSON.parse(data.category.replace(/"/gi, '"'))
    //   data.tags = Object.keys(data.category)
    // })
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/info/ById/:id', async (req, res) => {

  try {
    const result = await Product.selectById(req.params.id);
    // result.map((data)=>{
    //   data.category = JSON.parse(data.category.replace(/"/gi, '"'))
    //   data.tags = Object.keys(data.category)
    // })
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/info/:id', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const result = await Product.InfoByID(req.params.id);
    const response = result.map((data)=>{
      const json = {
        id: data.id,
        name: data.name,
        image: data.image,
        price: data.price,
        url: data.url,
        category: data.category,
        disabled: data.disabled,
      }
      return json
    })
    res.json({status: "ok",response});
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//update product weight
router.post('/updateWeight', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const {
      id,
      category
    } = req.body;
    // const {
    //   id
    // } = req.params;
    // console.log(category)
    // console.log(id)
    const result = await Product.updateWeight(id, category);
    if (!result) throw new Error('PRODUCT_NOT_FOUND');
    res.json({
      status: 'ok'
  });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/AllTitle', async (req, res) => {
  try {
    const dataList = await Product.Alltitle();
    res.json({status: "ok",response: dataList});
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;