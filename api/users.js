const express = require("express");
const router = express.Router();
const { createUser, getUserByUsername, getUser, getUserById, getPublicRoutinesByUser, getAllRoutinesByUser} = require('../db');
const { PasswordTooShortError, UserTakenError, } = require("../errors");
const jwt = require('jsonwebtoken');
const { requireUser } = require("./utils");
const { JWT_SECRET } = process.env;

// POST /api/users/register
router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try{
        if (req.body.password.length < 8) {
            res.send({
                error: 'PasswordTooShort',
                name: 'PasswordTooShort',
                message: PasswordTooShortError(),
            });
        } else {
            const userByName = await getUserByUsername(username);
         if (userByName) {
            res.send({
                error: 'Username already taken',
                name: 'UsernameAlreadyTaken',
                message: UserTakenError(userByName.username),
            });
         } else {
                const user = await createUser({ username, password });
                const token = jwt.sign({ username }, JWT_SECRET);
                if (user) {
                     res.send({
                       name: 'Successfully Registered.',
                       message: 'Successfully Registered.',
                       token: token,
                       user: {
                        id: user.id,
                        username: username
                       },
                     });
                 }
            }
        }

    } catch(error) {
    next(error);        
    }
});

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await getUser({ username, password });
      console.log("USER!!!", user);
      if (user) {
        const token = jwt.sign({
          id: user.id,
          username
        }, JWT_SECRET);
        const verifiedUser = {
          message: "you're logged in!",
          user,
          token
        }
        res.send(verifiedUser);
      }
    } catch (error) {
      next(error)
  }
});

// GET /api/users/me
router.get('/me', async (req, res, next) => {
  const header = req.headers.authorization

  if (!header) {
      res.status(401).send({
          error: "Error logging in",
          message: "You must be logged in to perform this action",
          name: "Log in for access"
      })} else {
      try {
          const token = header.split(" ")[1]
          const verified = jwt.verify(token, JWT_SECRET)
          const userId = verified.id
          const user = await getUserById(userId)

          res.send({
              id: user.id,
              username: user.username
          })
      } catch ({error}) {
          next({error})
      }
  }
});

// GET /api/users/:username/routines
router.get('/:username/routines', async (req, res, next) => {
  const { username } = req.params
  const authHeader = req.headers.authorization;
  try {
      const token = authHeader.split(" ")[1];
      const verified = jwt.verify(token, JWT_SECRET);
      const loggedIn = verified.username

      if (loggedIn !== username) {
          const publicRoutines = await getPublicRoutinesByUser({ username })
          res.send(publicRoutines)
      }
      else if (loggedIn === username) {
          const routines = await getAllRoutinesByUser({ username })
          res.send(routines)
      }
  } catch(error) {
      next(error)
  }
})

module.exports = router