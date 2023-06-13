const express = require("express");
const router = express.Router();
const { createUser, getUserByUsername,} = require('../db');
const { PasswordTooShortError, UserTakenError } = require("../errors");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try{
        if (req.body.password.length < 8) {
            res.send({
                error: 'PasswordTooShort',
                name: 'PasswordTooShort',
                message: PasswordTooShortError(),
            });
        } else {
            const userByName = await getUserByUsername(username);
         if (userByName) {
            res.send({
                error: 'Username already taken',
                name: 'UsernameAlreadyTaken',
                message: UserTakenError(userByName.username),
            });
         } else {
                const user = await createUser({ username, password });
                const token = jwt.sign({ username }, JWT_SECRET);
                if (user) {
                     res.send({
                       name: 'Successfully Registered.',
                       message: 'Successfully Registered.',
                       token: token,
                       user,
                     });
                 }
            }
        }

    } catch(error) {
    next(error);        
    }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    
});

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router
