const express = require('express');
const router = express.Router();
const Permissions = require('../util/permission');

const Category = require('../model/Category');
const { request } = require('https');
const { isNull } = require('util');


//get all categories info
router.get('/info/all', async (req, res) => {
  //const isAdmin = Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const result = await Category.selectAll();
    result.map((data)=> {
      data.Source = data.Source.split(',') // if Source is null, it will return error
    });
    //const temp1 = temp[1].split(',');


    /*for(i; i<temp.length; i++)
    {
      result.map((data)=>data.Source)[i] = temp[i].split(',')
    }*/
    
    // result.map((data)=>{
    //   data.Source = source
    // })
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//get category info by id
router.get('/info/:id', async (req, res) => {
  //const isAdmin = Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    // will throw error if undefined
    const {
      id
    } = req.params;

    const result = await Category.findById(id);
    if (!result) throw new Error('CATEGORY_NOT_FOUND');

    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//add category
router.post('/addCategory', async (req, res) => {
  try {
    const {
      Name, groupName, Source
    } = req.body;
    const list = await Category.groupIdCheck(groupName)
    //const result = await Category.addCategory({Name, CategoryGroupID, Source});
  //how to reject duplicate category name??? Error('category name already exists')
  
  try {
    const group_id = list[0].id;
    const result = await Category.addCategory(Name, group_id, Source);
    res.json({
      status: 'ok'
      
    });
  } 


  catch (err) {
    throw new Error('GROUP_NOT_FOUND');
  }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//update category 
router.post('/updateCategory/', async (req, res) => {
  try {
    const {
      id, Name, groupName, Source
    } = req.body;
    const list = await Category.groupIdCheck(groupName)
    try {
      const group_id = list[0].id
      const result = await Category.updateCategory(id, Name, group_id, Source);
      res.json({
        status: 'ok'
      });
    }
    catch (err) {
      throw new Error('GROUP_NOT_FOUND');
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

/*
//delete category 
router.post('/deleteCategory/:id', async (req, res) => {
  //const isAdmin = Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    // will throw error if undefined
    const {
      id
    } = req.params;

    const result = await Category.deleteById(id);
    if (!result) throw new Error('CATEGORY_NOT_FOUND');

    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});
*/

module.exports = router;