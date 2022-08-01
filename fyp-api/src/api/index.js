const express = require('express');
const router = express.Router();

const weather = require('./weather');
const traffic = require('./traffic');
const public = require('./public');
const health = require('./health');

const menuItem = require('./menuItem');
const user = require('./user');
const role = require('./role');
const admin = require('./admin');
const survey = require('./survey');
const surveyResult = require('./surveyResult');
const rules = require('./rules');
const article = require('./article');
const category = require('./category');
const category_group = require('./category_group');
const course = require('./course');
const product = require('./product');
const notiRules = require('./notificationRules');
const prioritized = require('./prioritized');
const advertisement = require('./advertisement');
const attribute = require('./attribute');
const similar = require('./similar');
const nc = require('./notificationCenter')

router.use('/health', health);
router.use('/weather', weather);
router.use('/traffic', traffic);
router.use('/public', public);
router.use('/menuItem', menuItem);
router.use('/user', user);
router.use('/role', role);
router.use('/admin', admin);
router.use('/survey', survey);
router.use('/surveyResult', surveyResult);
router.use('/rules', rules);
router.use('/article', article);
router.use('/category', category);
router.use('/category_group', category_group);
router.use('/course', course);
router.use('/product', product);
router.use('/notification', notiRules)
router.use('/prioritized', prioritized);
router.use('/adv', advertisement);
router.use('/attribute', attribute);
router.use('/similar', similar);
router.use('/nc', nc);


module.exports = router;