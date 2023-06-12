const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{
    const { rows: [routine] } = await client.query(`

    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `,[creatorId, isPublic, name, goal]);

    return routine;
  }catch(error){
    console.error('ERROR Creating Routine!!!',error);
    throw error;
  }
};

async function getRoutineById(id) {
  try { 
    const { rows: [ routine ] } = await client.query(`
    SELECT *
    FROM routines
    WHERE id=$1;
    `, [id]);

    return routine;

  } catch(ex) {console.log(ex)}
};

async function getRoutinesWithoutActivities() {
    const {rows} = await client.query(`
      SELECT *
      FROM routines;
    `); 
    return rows;
};

async function getAllRoutines() {
  const { rows: routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id;
  `);

return await attachActivitiesToRoutines(routines);
};

async function getAllPublicRoutines() {
  const {rows: routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "isPublic" = true;
  `)
  return await attachActivitiesToRoutines(routines);
};

async function getAllRoutinesByUser({ username }) {
  const {rows: routines} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  WHERE ($1) = users.username;
`, [ username ])
return await attachActivitiesToRoutines(routines);
}

async function getPublicRoutinesByUser({ username }) {
  const {rows: routines} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  WHERE ($1) = users.username AND "isPublic" = true;
`, [username])
return await attachActivitiesToRoutines(routines);
}

async function getPublicRoutinesByActivity({ id }) {
  const {rows: routines} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  JOIN routine_activities 
  ON routine_activities."routineId" = routines.id
  WHERE routines."isPublic" = true 
  AND routine_activities."activityId" = $1;
`, [id])
//console.log(routines)
return attachActivitiesToRoutines(routines);
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`).join(`, `);

    const { rows: [ routines ] } = await client.query(`
    UPDATE routines
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
  `, Object.values(fields));

  return routines;
}

async function destroyRoutine(id) {
  await client.query(`
  DELETE FROM routine_activities
  WHERE "routineId" = $1
  `, [id])
  const {rows: routine} = await client.query(`
  DELETE FROM routines
  WHERE id = $1
  RETURNING *;
  `, [id])
  return routine;
}


module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
