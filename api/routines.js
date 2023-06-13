const express = require('express');
const routinesRouter = express.Router();
const { UnauthorizedError } = require('../errors');
const { requireUser } = require('./utils');
const {
    getAllRoutines,
    createRoutine,
} = require('../db');


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
routinesRouter.post('/', requireUser, async (req, res, next) => {
  try{
  const { isPublic, name, goal } = req.body;
  const userId = req.user.id;
      const routine = await createRoutine({ 
        creatorId: userId, 
        isPublic: isPublic, 
        name: name, 
        goal: goal 
      });
      if (routine) {
      res.send(routine);
  };
    } catch (error) {
      next(error);
    }
  });

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;