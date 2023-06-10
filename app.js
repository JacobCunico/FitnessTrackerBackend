require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors');
const apiRouter = require('./api')
const client = require('./db/client');

app.use(cors());
// json body parser
app.use(express.json());

// Setup your Middleware and API Router here
app.use('/api', apiRouter);

//ERROR HANDLER
app.use((error, req, res, next) => {
    res.send({
        error: 'Some/any string',
        message: error.message,
        name: 'Some/any string'
    })
})

client.connect();

module.exports = app;