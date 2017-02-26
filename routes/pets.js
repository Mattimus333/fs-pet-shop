var express = require('express');
var router = express.Router();

var path = require('path');
var petsPath = path.join(__dirname, '../pets.json');


app.get('/pets', function(req, res) {
    fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
        if (err) {
            console.error(err.stack);
            return res.sendStatus(500);
        }

        var pets = JSON.parse(petsJSON);

        return res.send(pets);
    });
});
