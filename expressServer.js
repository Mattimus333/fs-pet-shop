'use strict';

var fs = require('fs');
var path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
var port = process.env.PORT || 8000;

app.disable('x-powered-by');

app.get('/pets', function(req, res){
  fs.readFile(petsPath, 'utf8', function(err, petsJSON){
    if (err){
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var pets = JSON.parse(petsJSON);

    res.send(pets);
  });
});

app.get('/pets/:index', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    var index = Number.parseInt(req.params.index);
    var pets = JSON.parse(petsJSON);

    if (index < 0 || index >= pets.length || Number.isNaN(index)){
      return res.sendStatus(404);
    }

    res.set('Content-Type', 'application/json');
    res.send(pets[index]);
  });
});

app.post('/pets', function(req, res) {
  fs.readFile(petsPath, 'utf8', function(err, petsJSON){
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
    }
    else{
      res.sendStatus(400);
    }

    var petsJSON = JSON.stringify(pets);
    fs.writeFile(petsPath, petsJSON, function(writeErr) {
        if (writeErr) {
            console.log(writeErr.stack);
        }
    });

  });
});

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function(){
  console.log('listening on port', port);
})

module.exports = app;
