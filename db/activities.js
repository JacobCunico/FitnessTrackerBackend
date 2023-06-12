const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  try {
    const {rows: [ newActivity ]} = await client.query(`
    INSERT INTO activities(name, description)
    VALUES ($1, $2)
    RETURNING *;
    `, [name, description]);

  // return the new activity
  return newActivity;
} catch(ex) {};
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const {rows} = await client.query(`
    SELECT *
    FROM activities
    `);

    return rows;

  } catch(ex) {console.log(ex)}
};

async function getActivityById(id) {
  try {
    const {rows: [activity]} = await client.query(`
      SELECT id, name, description
      FROM activities
      WHERE id=${id}
    `);

    return activity;

  } catch(ex) {console.log(ex)}
};

async function getActivityByName(name) {  try {
  const {rows: [activityName]} = await client.query(`
    SELECT id, name, description
    FROM activities
    WHERE name=$1
  `, [name]);

  return activityName;

} catch(ex) {console.log(ex)}
};

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  const routineIDs = routines.map(routine => routine.id);

  const {rows: activities} = await client.query(`
  SELECT activities.*, routine_activities.id AS "routineActivityId", 
  routine_activities."routineId",
  routine_activities.duration,
  routine_activities.count
  FROM activities
  JOIN routine_activities ON activities.id = routine_activities."activityId";
  `)

  routines.forEach(
    routine => routine.activities = activities.filter(
      activity => routine.id === activity.routineId ));

  return routines;
};

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`).join(`, `);

    try {
      const { rows: [ user ] } = await client.query(`
        UPDATE activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (error) {
      throw error;
    }
};

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};