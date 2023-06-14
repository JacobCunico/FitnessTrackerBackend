const express = require("express");
const {
    updateRoutineActivity,
    canEditRoutineActivity,
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


module.exports = router;
