'use strict';

//import and start an express app
const EXPRESS = require('express');
const APP = EXPRESS();
//set port
const PORT = process.env.PORT || 8000;
//imports auth function
const AUTH = require('./controllers/auth-function');
//imports the routing file and routes all requests from pets
const PETS = require('./controllers/routes/pets');
APP.use(AUTH, PETS);
//404s requests to the wrong path
APP.use(function(req, res) {
  res.sendStatus(404);
});
//turn on server
APP.listen(PORT, function() {
    console.log('listening on port', PORT);
});

//export required for test file
module.exports = APP;
