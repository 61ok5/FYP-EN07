const express = require('express');
const router = express.Router();
const Helper = require('../util/helper');

const Prioritized = require('../model/Prioritized');
const Product = require('../model/Product');
const Course = require('../model/Course');
const Article = require('../model/Article');
const { json } = require('express');

router.get('/all/:type', async (req, res) => {
  try {
    const {
      type
    } = req.params;

    res.json({ status: 'ok', response: (await Prioritized.selectAll(type)) });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/rule', async (req, res) => {

  try {
    const result = await Prioritized.selectRule();


    let response = result.map(async (data) => {

      //get article column
      const article = JSON.parse(data.article);
      let article_content = await article.map(async (element) => {
        if (element === undefined) {
        } else {
          const article_info = await Article.InfoByID(element[0])
          const json = {};
          json[article_info[0].title] = element[1];
          return json;
        }
      })
      article_content = await Promise.all(article_content);
      article_content = article_content.filter(notUndefined => notUndefined !== undefined);
      article_content = Object.assign({}, ...article_content);

      //get product column
      const product = JSON.parse(data.product);
      let product_content = await product.map(async (element) => {
        if (element === undefined) {
        } else {
          const product_info = await Product.InfoByID(element[0])
          const json = {};
          json[product_info[0].name] = element[1];
          return json;
        }
      })
      product_content = await Promise.all(product_content);
      product_content = product_content.filter(notUndefined => notUndefined !== undefined);
      product_content = Object.assign({}, ...product_content);

      //get course column
      const course = JSON.parse(data.course);
      let course_content = await course.map(async (element) => {
        if (element === undefined) {
        } else {
          const course_info = await Course.InfoByID(element[0])
          const json = {};
          json[course_info[0].title] = element[1];
          return json;
        }
      })
      course_content = await Promise.all(course_content);
      course_content = course_content.filter(notUndefined => notUndefined !== undefined);
      course_content = Object.assign({}, ...course_content);

      const json = {
        user_id: data.user_id,
        source: 0,
        article: article_content,
        product: product_content,
        activity: course_content,
      }
      return json
    })

    response = await Promise.all(response)

    res.json({ status: 'ok', response });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/collaborative', async (req, res) => {

  try {
    const result = await Prioritized.selectColla();
    let response = result.map(async (data) => {

      //get article column
      const article = JSON.parse(data.article);
      let article_content = await article.map(async (element) => {
        if (element === undefined) {
        } else {
          const article_info = await Article.InfoByID(element[0])
          const json = {};
          json[article_info[0].title] = element[1];
          return json;
        }
      })
      article_content = await Promise.all(article_content);
      article_content = article_content.filter(notUndefined => notUndefined !== undefined);
      article_content = Object.assign({}, ...article_content);

      //get product column
      const product = JSON.parse(data.product);
      let product_content = await product.map(async (element) => {
        if (element === undefined) {
        } else {
          const product_info = await Product.InfoByID(element[0])
          const json = {};
          json[product_info[0].name] = element[1];
          return json;
        }
      })
      product_content = await Promise.all(product_content);
      product_content = product_content.filter(notUndefined => notUndefined !== undefined);
      product_content = Object.assign({}, ...product_content);

      //get course column
      const course = JSON.parse(data.course);
      let course_content = await course.map(async (element) => {
        if (element === undefined) {
        } else {
          const course_info = await Course.InfoByID(element[0])
          const json = {};
          json[course_info[0].title] = element[1];
          return json;
        }
      })
      course_content = await Promise.all(course_content);
      course_content = course_content.filter(notUndefined => notUndefined !== undefined);
      course_content = Object.assign({}, ...course_content);

      const json = {
        user_id: data.user_id,
        source: 1,
        article: article_content,
        product: product_content,
        activity: course_content,
      }
      return json
    })

    response = await Promise.all(response)
    res.json({ status: 'ok', response });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/:source/:type/:userId', async (req, res) => {
  try {
    let sourceName;
    let typecode;
    const {
      source,
      type,
      userId
    } = req.params;

    switch (source) {
      case 'article':
        sourceName = 'article';
        break;
      case 'product':
        sourceName = 'product';
        break;
      case 'activity':
        sourceName = 'course';
        break;
      default:
        res.status(400).json({ error: "invalid source" });
        break;
    }

    switch (type) {
      case 'rule':
        typecode = 0;
        break;
      case 'combine':
        typecode = 1;
        break;
      case 'collaborative':
        typecode = 2;
        break;
      default:
        res.status(400).json({ error: "invalid type" });
        break;
    }

    const result = await Prioritized.selectByUserId(userId);
    if (!result) res.status(400).json({ error: "user not found" });

    res.json(Helper.jsonTryParse(result[`s${typecode}_${sourceName}`]));
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

router.get('/combine', async (req, res) => {

  try {
    const result = await Prioritized.selectCombine();
    let response = result.map(async (data) => {

      //get article column
      const article = JSON.parse(data.article);
      let article_content = await article.map(async (element) => {
        if (element === undefined) {
        } else {
          const article_info = await Article.InfoByID(element[0])
          const json = {};
          json[article_info[0].title] = element[1];
          return json;
        }
      })
      article_content = await Promise.all(article_content);
      article_content = article_content.filter(notUndefined => notUndefined !== undefined);
      article_content = Object.assign({}, ...article_content);

      //get product column
      const product = JSON.parse(data.product);
      let product_content = await product.map(async (element) => {
        if (element === undefined) {
        } else {
          const product_info = await Product.InfoByID(element[0])
          const json = {};
          json[product_info[0].name] = element[1];
          return json;
        }
      })
      product_content = await Promise.all(product_content);
      product_content = product_content.filter(notUndefined => notUndefined !== undefined);
      product_content = Object.assign({}, ...product_content);

      //get course column
      const course = JSON.parse(data.course);
      let course_content = await course.map(async (element) => {
        if (element === undefined) {
        } else {
          const course_info = await Course.InfoByID(element[0])
          const json = {};
          json[course_info[0].title] = element[1];
          return json;
        }
      })
      course_content = await Promise.all(course_content);
      course_content = course_content.filter(notUndefined => notUndefined !== undefined);
      course_content = Object.assign({}, ...course_content);

      const json = {
        user_id: data.user_id,
        source: 2,
        article: article_content,
        product: product_content,
        activity: course_content,
      }
      return json
    })

    response = await Promise.all(response)
    res.json({ status: 'ok', response });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
  return json;
});


module.exports = router;