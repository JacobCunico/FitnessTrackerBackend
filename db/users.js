const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try{
    const { rows: [ user ] } = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password]);

    delete user.password;

   return user;
  } catch(ex) {
      console.log(ex);
   }
};

async function getUser({ username, password }) {
   try { const {rows: [user]} = await client.query (`
    SELECT *
    FROM users
    WHERE username=$1 AND password=$2
   `, [username, password]);

   if (!user) {
    return null
   } else {
    delete user.password
    return user
  };

} catch (ex) {
  console.log(ex)
}
};

async function getUserById(userId) {
  try{
  const {rows: [user] } = await client.query(`
    SELECT id, username, password
    FROM users
    WHERE id=${userId}
  `,);
  delete user.password
  return user;

  } catch(ex) {};
}

async function getUserByUsername(userName) {
  try{ 
  const {rows: [user] } = await client.query (`
  SELECT username, password
  FROM users
  WHERE username=$1
 `, [userName]);

 return user;

} catch (ex) {
console.log(ex)
}};


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
