const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [ newRoutine ] } = await client.query(`
    INSERT INTO routines( "creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [ creatorId, isPublic, name, goal ]);

    //console.log("TESTING CREATE", newRoutine);
    return newRoutine;
  } catch(ex) {console.log(ex)}
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

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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
