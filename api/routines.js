const express = require('express');
const routinesRouter = express.Router();
const {
    getAllRoutines,
    createRoutine,
} = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');

// GET /api/routines
routinesRouter.get('/', async (req, res, next) => {
    try {
      const routines = await getAllRoutines();
  
      res.send(routines);
    } catch (error) {
      next(error);
    }
  });

// POST /api/routines
routinesRouter.post('/', async (req, res, next) => {
    try {
      const { isPublic, name, goal } = req.body;
      const id = req.user.id;
      const routine = await createRoutine({ id, isPublic, name, goal });
        
      res.status(201).json(routine);
    } catch (error) {
      next(error);
    }
  });

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;