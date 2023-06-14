const express = require('express');
const router = express.Router();
const { requireUser } = require("./utils");

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const id = req.user.id;
    try {
        const routineToUpdate = await getRoutineActivityById(routineActivityId);
        const routineId = await getRoutineById(routineToUpdate.routineId);

        if (!routineToUpdate) {
            next({ name: "NotFound", message: "no Routine Activity found" });
        }
        const checkUser = await canEditRoutineActivity(routineActivityId, id);
        if (!checkUser) {
            next({
                name: "UpdateActivityError",
                message: UnauthorizedUpdateError(req.user.username, routineId.name),
            });
        } else {
            const updateActivity = await updateRoutineActivity({
                id: routineActivityId,
                count,
                duration,
            });
            res.send(updateActivity);
        }
    } catch (error) {
        next(error);
    }
});

// DELETE /api/routine_activities/:routineActivityId


module.exports = router;
