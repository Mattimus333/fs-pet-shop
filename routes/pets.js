var express = require('express');
var router = express.Router();

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, '../pets.json');

var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

//gets all pets
router.get('/pets', function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.error(err.stack);
            return res.sendStatus(500);
        }

        var pets = JSON.parse(petsJSON);

        return res.send(pets);
    });
});

//gets pets at specified index
router.get('/pets/:index', function(req, res) {
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

//
router.post('/pets', function(req, res) {
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

router.patch('/pets/:index', function(req, res) {
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

router.delete('/pets/:index', function(req, res) {
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

module.exports = router;
