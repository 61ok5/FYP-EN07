const express = require('express');
const router = express.Router();
const Permissions = require('../util/permission');
const middlewares = require('../middlewares');

router.use(middlewares.adminOnly);

router.get('/', async (req, res) => {
    try {
        let result = {};
        const insertMenuItem = (id, visible, url) => {
            result[id] = {
                visible,
                url
            }
        };

        insertMenuItem('navigation', true, null);
        insertMenuItem('dashboard', (req.user.id === 58), '/dashboard');
        const adminuserVisible = await Permissions.checkByReqUser(req.user, 'view:user')
        insertMenuItem('survey', adminuserVisible, null);
        insertMenuItem('list_survey', adminuserVisible, '/survey/list');
        insertMenuItem('result_survey', adminuserVisible, '/survey/result');
        insertMenuItem('list', true, null);
        insertMenuItem('list_article', true, '/list/article');
        insertMenuItem('list_interest', true, '/list/interest');
        insertMenuItem('list_eproduct', true, '/list/eproduct');
        insertMenuItem('list_prioritized_article', true, '/list/prioritized/article');
        insertMenuItem('list_prioritized_activity', true, '/list/prioritized/activity');
        insertMenuItem('list_prioritized_product', true, '/list/prioritized/product');
        insertMenuItem('settings', true, null);
        insertMenuItem('settings_attribute_options', true, '/settings/attributeoptions');
        insertMenuItem('settings_attribute', true, '/settings/attribute');
        insertMenuItem('settings_category', true, '/settings/category');
        insertMenuItem('settings_categorygroup', true, '/settings/categorygroup');
        insertMenuItem('rules', adminuserVisible, null);
        insertMenuItem('rules_categorization', adminuserVisible, '/rules/categorizationrules');
        insertMenuItem('rules_notification', adminuserVisible, '/rules/notificationrules');
        insertMenuItem('global_setting', adminuserVisible, '/settings/globalsetting');
        insertMenuItem('front_page', true, '/front_page');

        insertMenuItem('users', true, null);
        insertMenuItem('users_userprofile', true, '/users/profile');
        insertMenuItem('users_endusers', true, '/users/enduser');

        insertMenuItem('adv_notification', (req.user.id === 58), '/rules/adv');
        insertMenuItem('notification_center', adminuserVisible, '/rules/notification_center');

        res.json(result);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
