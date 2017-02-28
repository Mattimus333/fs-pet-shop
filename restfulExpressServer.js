'use strict';

var express = require('express');
var app = express();
var basicAuth = require('basic-auth');
var port = process.env.PORT || 8000;

var auth = function(req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm="Required"');
        return res.send(401);
    };

    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name === 'admin' && user.pass === 'meowmix') {
        return next();
    } else {
        return unauthorized(res);
    };
}

var pets = require('./controllers/routes/pets');
app.use(auth, pets);

app.use(function(req, res) {
  res.sendStatus(404);
});


app.listen(port, function() {
    console.log('listening on port', port);
});

module.exports = app;
