const express = require("express");
const {
    updateRoutineActivity,
    canEditRoutineActivity,
    destroyRoutineActivity,
} = require("../db");
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", async (req, res, next) => {
    try {

        const { routineActivityId } = req.params;
        const { count, duration } = req.body;
        const canEdit = await canEditRoutineActivity(routineActivityId, req.userId)
        if(canEdit) {
        const update = await updateRoutineActivity({
            id: routineActivityId,
            count,
            duration
        })
        res.send(update);
    } else {
        res.send({
            error: " ",
            message: " ",
            name: " "
        })
    }
    } catch (error) {
        next(error);
    }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId'), async (req, res, next) => {
    try{
        const token = req.headers["Authorization"];
        // find routine activity based in req.id
        // find the routine based on "routineId"
        // verify the token for the users id
        // compare the users.id to routine's "creatorId"
        // if they're equal then destroy routine activity
        const destroyActivity = destroyRoutineActivity(req.id);
        res.send(destroyActivity);
    } catch(error) {
        next(error)
    };
};

module.exports = router;
