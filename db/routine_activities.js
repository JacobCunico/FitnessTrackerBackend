const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
  const { rows: [ activityRoutine ] } = await client.query(`
  INSERT INTO routine_activities("routineId", "activityId", count, duration)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `, [routineId, activityId, count, duration,]);
 return activityRoutine;
} catch(ex) {console.log(ex)}
};

async function getRoutineActivityById(id) {
  try { 
    const { rows: [ routineActivity ] } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id=$1;
    `, [id]);

    return routineActivity;

  } catch(ex) {console.log(ex)}
}

async function getRoutineActivitiesByRoutine({ id }) {
  try { 
    const { rows: routine } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE routine_activities.id = $1;
    `, [id]);

    return routine;

  } catch(ex) {console.log(ex)}
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`).join(`, `);

    const { rows: [ routineActivity ] } = await client.query(`
    UPDATE routine_activities
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
  `, Object.values(fields));

  return routineActivity;
}

async function destroyRoutineActivity(id) {
  const {rows: [routineActivity] } = await client.query(`
  DELETE FROM routine_activities
  WHERE id = $1
  RETURNING *;
  `, [id]) 

  return routineActivity;
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const {rows: [routine]} = await client.query(`
    SELECT *
    FROM routine_activities
    JOIN routines ON routine_activities."routineId" = routines.id
    AND routine_activities.id = $1
  `, [routineActivityId]);
  console.log(routine, userId);
  return routine.creatorId === userId
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
