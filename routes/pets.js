const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, '../pets.json');

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
  var index = Number.parseInt(req.params.index);
    if (index < 0 || Number.isNaN(index)) {
      return res.sendStatus(404);
    } else {
      fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
          console.error(err.stack);
          return res.sendStatus(500);
        }

        var age = parseInt(req.body.age);
        var kind = req.body.kind;
        var name = req.body.name;
        var pets = JSON.parse(petsJSON);

        if (index >= pets.length) {
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
    }
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
