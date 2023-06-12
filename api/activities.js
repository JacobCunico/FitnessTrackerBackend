const express = require('express');
const router = express.Router();
const { getAllActivities } = require("../db")

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
    try {
        const activities = await getAllActivities();
    
        res.send(activities);
      } catch (error) {
        next(error);
      }
});

// GET /api/activities

// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;