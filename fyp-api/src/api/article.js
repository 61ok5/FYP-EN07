const express = require('express');
const router = express.Router();
const Permissions = require('../util/permission');

const Article = require('../model/Article');


//get all articles info
router.get('/info/all', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const result = await Article.selectAll();
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

router.get('/info/:id', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const result = await Article.InfoByID(req.params.id);
    const response = result.map((data)=>{
      const json = {
        id: data.id,
        disabled: data.disabled,
        title: data.title,
        content: data.content,
        category: data.category,
        url: data.url,
        contentful_id: data.contentful_id,
        order: data.order,
      }
      return json
    })
    res.json({status: "ok",response});
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//update article weight
router.post('/updateWeight', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const {
      id,
      category
    } = req.body;

    const result = await Article.updateWeight(id, category);
    if (!result) throw new Error('ARTICLE_NOT_FOUND');
    res.json({
      status: 'ok'
  });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/AllTitle', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const dataList = await Article.Alltitle();
     const response = dataList.map((data)=>{
       const json={
         id: data.id,
         title: data.title,
       }
       return json;
     })
    res.json({status: "ok",response});
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;