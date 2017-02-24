'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');
var express = require('express');
var app = express();
var basicAuth = require('basic-auth');
var morgan = require('morgan');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

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

app.disable('x-powered-by');

app.use(morgan('common'));

app.get('/pets', auth, function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.error(err.stack);
            return res.sendStatus(500);
        }

        var pets = JSON.parse(petsJSON);

        return res.send(pets);
    });
});

app.get('/pets/:index', auth, function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.error(err.stack);
            return res.sendStatus(500);
        }
        var index = Number.parseInt(req.params.index);

        var pets = JSON.parse(petsJSON);

        if (index < 0 || index >= pets.length || Number.isNaN(index)) {
            return res.sendStatus(404);
        }

        res.set('Content-Type', 'application/json');
        res.send(pets[index]);
    });
});

app.post('/pets', auth, function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.error(err.stack);
            return res.sendStatus(500);
        }

        var age = parseInt(req.body.age);
        var kind = req.body.kind;
        var name = req.body.name;
        var pets = JSON.parse(petsJSON);

        if (age && kind && name && !Number.isNaN(age)) {
            let newPet = {};
            newPet.age = age;
            newPet.kind = kind;
            newPet.name = name;
            pets.push(newPet);
            res.set('Content-Type', 'application/json');
            res.send(newPet);
        } else {
            res.sendStatus(400);
        }

        var petsJSON = JSON.stringify(pets);
        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                console.log(writeErr.stack);
                res.sendStatus(500);
            }
        });

    });
});

app.patch('/pets/:index', auth, function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.error(err.stack);
            return res.sendStatus(500);
        }

        var index = Number.parseInt(req.params.index);
        var age = parseInt(req.body.age);
        var kind = req.body.kind;
        var name = req.body.name;
        var pets = JSON.parse(petsJSON);

        if (index < 0 || index >= pets.length || Number.isNaN(index)) {
            return res.sendStatus(404);
        } else {
            if (kind) {
                pets[index].kind = kind;
            }
            if (age) {
                pets[index].age = age;
            }
            if (name) {
                pets[index].name = name;
            }
            res.set('Content-Type', 'application/json');
            res.send(pets[index]);
        }

        var petsJSON = JSON.stringify(pets);
        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                console.log(writeErr.stack);
                res.sendStatus(500);
            }
        });

    });
});

app.delete('/pets/:index', auth, function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.error(err.stack);
            return res.sendStatus(500);
        }

        var index = Number.parseInt(req.params.index);
        var pets = JSON.parse(petsJSON);

        if (index < 0 || index >= pets.length || Number.isNaN(index)) {
            return res.sendStatus(404);
        } else {
            res.set('Content-Type', 'application/json');
            res.send(pets.splice(index, 1)[0]);
        }

        var petsJSON = JSON.stringify(pets);
        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                console.log(writeErr.stack);
                res.sendStatus(500);
            }
        });

    });
});

app.use(function(req, res) {
    res.sendStatus(404);
});

app.listen(port, function() {
    console.log('listening on port', port);
})

module.exports = app;
