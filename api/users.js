/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { creatUser } = require('../db');

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    try{
        if (req.body.password.length < 8) {
            next({message: "Password Too Short!"})
        };

       const user = await creatUser(req.body);


       res.send({
        message: 'User Created',
        token: "fake token",
        user
       });

    } catch(ex) {
        next({message: `User ${req.body.username} is already taken.`})
    }
});

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
