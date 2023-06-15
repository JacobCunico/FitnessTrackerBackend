const express = require('express');
const router = express.Router();
const { getAllActivities, 
    createActivity, 
    updateActivity, 
    getActivityById, 
    getPublicRoutinesByActivity 
} = require("../db");


// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
      const activities = await getAllActivities();
      res.send(activities);
  } catch (error) {
      next(error);
  }
});

// POST /api/activities
router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  try {
      const newActivity = await createActivity({ name, description });
      if(!newActivity) {
        next({ name, message: `An activity with name ${name} already exists` });
      }    
      res.send(newActivity);
  } catch (error) {
    next({
        name: "NameAlreadyExists",
        message: `An activity with name ${name} already exists`,
    });
}});

// PATCH /api/activities/:activityId
router.patch("/:activityId", async (req, res, next) => {
    const { name, description } = req.body;
    const id = req.params.activityId;

    try {
        const activityBeforeUpdate = await getActivityById(id);
        if (!activityBeforeUpdate) {
            next({ name: "ActivityNotFound", message: `Activity ${id} not found`});
        } else {
            const updatedActivity = await updateActivity({ id, name, description });
            if (updatedActivity) {
                res.send(updatedActivity);
            }
        }
    } catch (error) {
        next({
            name: "NameAlreadyfExists",
            message: `An activity with name ${name} already exists`,
        });
    }
});

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
    const id = req.params.activityId;
    try {
        const check = await getActivityById(id);
        if (check) {
            const routines = await getPublicRoutinesByActivity({ id });
            res.send(routines);
        } else {
            next({ name: "ActivityIdError", message: `Activity ${id} not found` });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;