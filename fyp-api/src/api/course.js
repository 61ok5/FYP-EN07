const express = require('express');
const router = express.Router();
const Permissions = require('../util/permission');
// const { spawn } = require('child_process');
const { PythonShell } = require('python-shell');
const Course = require('../model/Course');
const fs = require("fs");

router.get('/result', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });
  const preload = req.query.preload || 0
  const mode = req.query.mode || 0
  const toDB = req.query.toDB || 0
  const id = req.query.id

  try {
    const { success, err = '', results } = await new Promise((resolve, reject) => {
      if (true) {
        let options = {
          mode: 'json',
          pythonOptions: ['-u'], // get print results in real-time
          scriptPath: '/home/user/api/src/util/',
          args: [preload, mode, toDB, id]
        };

        PythonShell.run('result.py', options, function (err, data) {
          if (err) {
            reject({ success: false, err });
            console.log('err', err)
          }
          resolve({ success: true, results: data });
        })
      }
      else
        resolve({ success: true });
    });
    res.json(results[0]);

    // res.json(results);

    // if (success) {
    //   fs.readFile("/home/user/api/src/util/ml_preloads/top.json", "utf8", (err, response) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     const data = JSON.parse(response);
    //     res.json(data.slice(0, num)); // your JSON file content as object
    //   });
    // }

  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/top', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });
  const preload = req.query.preload || 0
  const num = req.query.num || 10

  try {
    const { success, err = '', results } = await new Promise((resolve, reject) => {
      if (preload == 0) {
        let options = {
          mode: 'json',
          pythonOptions: ['-u'], // get print results in real-time
          scriptPath: '/home/user/api/src/util/',
          // args: [preload, num]
        };

        PythonShell.run('top.py', options, function (err, data) {
          if (err) {
            reject({ success: false, err });
          }
          resolve({ success: true });
          // res.json(data[0])
        })
      }
      else
        resolve({ success: true });
    });

    if (success) {
      fs.readFile("/home/user/api/src/util/ml_preloads/top.json", "utf8", (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
        const data = JSON.parse(response);
        res.json(data.slice(0, num)); // your JSON file content as object
      });
    }

  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

//get all courses info
router.get('/info/all', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });
  const PageNumber = req.query.PageNumber || null
  const RowsOfPage = req.query.RowsOfPage || null
  const Query = req.query.Query || ''
  console.log(PageNumber, RowsOfPage, Query)

  try {
    let result = (!PageNumber || !RowsOfPage) ? await Course.selectAll() : await Course.selectAllPage(PageNumber, RowsOfPage,Query);
    // result.map((data)=>{
    //   data.category = JSON.parse(data.category.replace(/"/gi, '"'))
    //   data.tags = Object.keys(data.category)
    // })
    const response = await Promise.all(result.map(async (data) => {
      const temp = await Course.TableContentByID(data.id)
      data.img = temp[0].image_304x171
      data.headline = temp[0].headline
      data.rating = temp[0].rating
      data.num_subscribers = temp[0].num_subscribers
      return data
    }))

    res.json(response);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/info/:id', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const result = await Course.InfoByID(req.params.id);
    const temp = await Course.CourseContentByID(req.params.id)
    const response = [{...result[0], 
      image_750x422: temp[0].image_750x422,
      img: temp[0].image_304x171,
      headline: temp[0].headline,
      rating: temp[0].rating.toPrecision(5),
      description: temp[0].description, }]
    

    // const response = result.map((data)=>{
    //   const json = {
    //     id: data.id,
    //     title: data.title,
    //     content: data.content,
    //     category: data.category,
    //     order: data.order,
    //   }
    //   return json
    // })
    res.json(response);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/img/:id', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const result = await Course.InfoByID(req.params.id);
    // const response = result.map((data)=>{
    //   const json = {
    //     id: data.id,
    //     title: data.title,
    //     content: data.content,
    //     category: data.category,
    //     order: data.order,
    //   }
    //   return json
    // })
    res.json({ status: "ok", result });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/list/info/all', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    console.log(req.user)
    const result = await Course.listSelectAll(req.user.id);
    res.json(result);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.post('/list/update', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const {
      course_id,
    } = req.body;

    const result = await Course.listUpdate(req.user.id, course_id);
    if (!result) throw new Error('COURSE_NOT_FOUND');
    res.json({
      status: 'ok'
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});










//update course weight
router.post('/updateWeight', async (req, res) => {
  //const isAdmin = await Permissions.isAdmin(req.user);
  //if (!isAdmin) res.status(401).json({ error: 'PERMISSION_DENIED' });

  try {
    const {
      id,
      category
    } = req.body;

    const result = await Course.updateWeight(id, category);
    if (!result) throw new Error('COURSE_NOT_FOUND');
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
    const dataList = await Course.Alltitle();
    const response = dataList.map((data) => {
      const json = {
        id: data.id,
        title: data.title,
      }
      return json;
    })
    res.json({ status: "ok", response });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;