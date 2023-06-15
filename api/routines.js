const express = require('express');
const router = express.Router();
const { requireUser } = require('./utils');
const {
    getAllRoutines,
    createRoutine,
    destroyRoutine,
} = require('../db');



// GET /api/routines
router.get('/', async (req, res, next) => {
    try {
      const routines = await getAllRoutines();
  
      res.send(routines);
    } catch (error) {
      next(error);
    }
});

// POST /api/routines
router.post('/', requireUser, async (req, res, next) => {
  try{
  const { isPublic, name, goal } = req.body;
  const userId = req.user.id;
  if(!req.user) {
    next({
      name: "not logged in",
      message: "you must be logged in"
    })} else {
      const routine = await createRoutine({ 
        creatorId: userId, 
        isPublic: isPublic, 
        name: name, 
        goal: goal 
    });
      if (routine) {
      res.send(routine);
  }};
    } catch (error) {
      next(error);
    }
});

// PATCH /api/routines/:routineId
router.patch('/', requireUser, async (req, res, next) => {
  
})

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;