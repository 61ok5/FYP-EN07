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
       
        insertMenuItem('settings', true, null);
        
        insertMenuItem('global_setting', adminuserVisible, '/settings/globalsetting');
        insertMenuItem('front_page', true, '/front_page');

        insertMenuItem('users', true, null);
        insertMenuItem('users_userprofile', true, '/users/profile');
        insertMenuItem('users_endusers', true, '/users/enduser');

        
        res.json(result);
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
