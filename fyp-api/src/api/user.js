const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const randtoken = require('rand-token');
const jwt = require('../util/jwt');
const Permissions = require('../util/permission');
const Validate = require('../util/validate');
const middlewares = require('../middlewares');

const User = require('../model/User');
const Role = require('../model/Role');
const Token = require('../model/Token');

// login
router.post('/login', async (req, res) => {
    try {
        // will throw error if undefined
        const {
            email,
            password
        } = req.body;

        const user = await User.findByEmail(email);

        if (!user) throw new Error('USER_NOT_FOUND');
        const pwdResult = await bcrypt.compare(password, user.password);
        if (!pwdResult) throw new Error('PASSWORD_NOT_MATCH');

        const refreshToken = randtoken.uid(200); // generate a refresh token
        const rt = await Token.createUser(user.user_id, res.locals.ip, refreshToken);
        const id = user.user_id;
        const token = jwt.signUser(user, rt);

        let result = {
            id,
            token,
            refreshToken
        };
        res.json(result);
    } catch (err) {
        console.log(err.message);
        res.status(401).json({ error: err.message });
    }
});

// revoke token
router.post('/revoke_token', async (req, res) => {
    try {
        let result = await Token.revoke(req.body.refresh_token);
        if (!result || result.length == 0) throw new Error('TOKEN_NOT_FOUND');

        res.json({
            status: 'ok'
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

// refresh token
router.post('/refresh_token', async (req, res) => {
    try {
        const token = await Token.get(req.body.refresh_token);
        if (!token || token.length == 0) throw new Error('TOKEN_NOT_FOUND');

        const user = await User.findById(token[0].user_id);
        if (!user) throw new Error('INVALID_TOKEN');

        const sinceLastRefresh = Date.now()/1000 - req.user.iat;
        const refreshToken = (sinceLastRefresh < 60) ? token[0].token : randtoken.uid(200);

        const updatedTokenObject = await Token.update(token[0].refresh_token_id, res.locals.ip, refreshToken);
        const newToken = jwt.signUser(user, updatedTokenObject); // generate jwt token

        res.json({ token: newToken, refreshToken });
    } catch (err) {
        console.log(err.message);
        res.status(401).json({ error: err.message });
    }
});

// router.use(middlewares.adminOnly);

// create user
router.post('/create', async (req, res) => {
    try {
        // will throw error if undefined
        const {
            email,
            password,
            nickname,
            tel,
            role_id
        } = req.body;

        // check create user permission
        // const hasRight = await Permissions.checkByReqUser(req.user, 'create:user');
        // if (hasRight) {
            try {
                if (!Validate.password(password, email)) throw new Error('PASSWORD_REQUIREMENT');
                if (email) if (!Validate.email(email)) throw new Error('EMAIL_INVALID');

                const hashedPassword = await bcrypt.hash(password, 10);

                const result = await User.create({
                    email,
                    hashedPassword,
                    nickname,
                    tel,
                    role_id
                });

                if (!result) throw new Error('DATABASE_ERROR');
                res.json({
                    status: 'ok'
                });
            } catch (err) {
                console.log(err.message);
                res.status(400).json({ error: err.message });
            }
        // } else {
        //     res.status(401).json({ error: "Why are you here?" });
        // }
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

//update user info
router.post('/updateInfo/', async (req, res) => {
    try {
        // will throw error if undefined
        const data = {
            nickname,
            tel,
            role_id
        } = req.body;

        // use request user_id if user_id undefined
        data.user_id = (!req.body.user_id) ? req.user.id : req.body.user_id;

        // skip permission check if is account owner
        let hasRight = data.user_id == req.user.id;
        // check req user has edit user permission and has higher role level than target user
        if (!hasRight) {
            hasRight = await Permissions.checkByReqUser(req.user, 'edit:user');
            if (hasRight) {
                hasRight = await Permissions.checkTargetAdminEditableByReqUser(req.user, data.user_id);
            }
        }

        if (hasRight) {
            // check if req user can access new role
            const canAccessNewRole = Permissions.checkTargetRoleAccessibleByReqUser(req.user, data.role_id);
            if (canAccessNewRole) {
                const adminOriginal = await User.findById(data.user_id);
                data.role_id = adminOriginal.role_id;
            }

            const result = User.updateInfo(data);

            if (!result) throw new Error('DATABASE_ERROR');
            res.json({
                status: 'ok'
            });

        } else {
            res.status(401).json({ error: "Why are you here?" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

// Change current user password (old password is required)
router.post('/changePassword/', async (req, res) => {
    try {
        // will throw error if undefined
        const {
            old_password,
            new_password,
            confirm_password
        } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) throw new Error('USER_NOT_FOUND');

        if (!bcrypt.compareSync(old_password, user.password)) throw new Error('OLD_PASSWORD_NOT_MATCH');
        if (new_password !== confirm_password) throw new Error('REPEAT_PASSWORD_MISMATCH');
        if (bcrypt.compareSync(new_password, user.password)) throw new Error('NEW_PASSWORD_SAME_AS_OLD_PASSWORD');
        if (!Validate.password(new_password, req.user.email)) throw new Error('PASSWORD_REQUIREMENT');

        const hashedPassword = bcrypt.hashSync(new_password, 10);
        const result = User.updatePassword({
            hashedPassword,
            user_id: req.user.id
        });

        if (!result) throw new Error('DATABASE_ERROR');
        res.json({
            status: 'ok'
        });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

// Reset user password (user edit right is required)
router.post('/resetPassword/', async (req, res) => {
    try {
        // will throw error if undefined
        const {
            user_id,
            new_password,
            confirm_password
        } = req.body;

        // check req user has edit user permission and has higher role level than target user
        let hasRight = await Permissions.checkByReqUser(req.user, 'edit:user');
        if (hasRight) {
            hasRight = await Permissions.checkTargetAdminEditableByReqUser(req.user, user_id);
        }

        if (hasRight) {

            const user = await User.findById(user_id);
            if (!user) throw new Error('USER_NOT_FOUND');

            if (new_password !== confirm_password) throw new Error('REPEAT_PASSWORD_MISMATCH');
            if (!Validate.password(new_password, user.email)) throw new Error('PASSWORD_REQUIREMENT');

            const hashedPassword = bcrypt.hashSync(new_password, 10);
            const result = User.updatePassword({
                hashedPassword,
                user_id
            });

            if (!result) throw new Error('DATABASE_ERROR');
            res.json({
                status: 'ok'
            });
        } else {
            res.status(401).json({ error: "Why are you here?" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

// get all user info
router.get('/info/all', async (req, res) => {
    // check view user permission
    const hasRight = await Permissions.checkByReqUser(req.user, 'view:user');
    if (hasRight) {
        const users = await User.selectAll();

        const reqUserRole = await Role.findById(req.user.role_id);

        let result = JSON.parse(JSON.stringify(users));
        result = result.map(async (user) => {
            delete user.password;
            delete user.password_history;
            // check if req user has permission to edit the user by role level
            user.editable = (user.role_level >= reqUserRole.level);
            user.last_login = await Token.getLastLoginByUserId(user.user_id);
            return user;
        });
        result = await Promise.all(result);

        res.json(result);
    } else {
        res.status(401).json({ error: "Why are you here?" });
    }
});

//get current user info
router.get('/me', async (req, res) => {
    const user = await User.findById(req.user.id);
    let result = JSON.parse(JSON.stringify(user));
    res.json(result);
});

// get admin info by id
router.get('/info/:user_id', async (req, res) => {
    try {
        // will throw error if undefined
        const {
            user_id
        } = req.params;

        // check view user permission
        const hasRight = await Permissions.checkByReqUser(req.user, 'view:user');
        if (hasRight) {
            const user = await await User.findById(user_id);

            let result = JSON.parse(JSON.stringify(user));
            delete result.password;
            delete result.password_history;
            res.json(result);
        } else {
            res.status(401).json({ error: "Why are you here?" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

//delete user
router.delete('/:user_id', async (req, res) => {
    try {
        // will throw error if undefined
        const {
            user_id
        } = req.params;

        // skip permission check if is account owner
        let hasRight = user_id == req.user.id;
        // check req user has delete user permission and has higher role level than target user
        if (!hasRight) {
            hasRight = await Permissions.checkByReqUser(req.user, 'delete:user');
            if (hasRight) {
                hasRight = await Permissions.checkTargetAdminEditableByReqUser(req.user, user_id);
            }
        }

        if (hasRight) {
            const result = await User.permDeleteById(user_id);

            if (!result) throw new Error('DATABASE_ERROR');
            res.json({
                status: 'ok'
            });
        } else {
            res.status(401).json({ error: "Why are you here?" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

//get api token
router.get('/api_token', async (req, res) => {
    try {
        const token = jwt.signApiToken();

        res.json({ token });
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
