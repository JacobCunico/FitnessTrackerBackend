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
            })
        } else {
            const User = await getUserByUsername(username);
         if (User) {
            res.send({
                error: 'Username already taken',
                name: 'UsernameAlreadyTaken',
                message: UserTakenError(User.username),
            });
         } else {
                const user = await createUser({ username, password });
                if (user) {
                    res.send({
                      name: 'Success Registering!!!',
                      message: 'Welcome You are Logged in!!!',
                      token: "fake",
                      user,
                    });
                }
            }
        }

    } catch(error) {
    throw error;        
    
    }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router
