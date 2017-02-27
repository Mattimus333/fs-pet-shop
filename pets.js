#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

if (cmd === 'read') {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
            throw err;
        }

        var pets = JSON.parse(data);
        var index = process.argv[3];

        if (index) {
            if (index >= pets.length || index < 0) {
                console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
                process.exit(1);
            } else {
                console.log(pets[index]);
            }
        } else {
            console.log(pets);
        }
    });
} else if (cmd === 'create') {
    fs.readFile(petsPath, 'utf8', function(readErr, data) {
        if (readErr) {
            throw readErr;
        }

        var pets = JSON.parse(data);
        var age = process.argv[3];
        var kind = process.argv[4];
        var name = process.argv[5];

        if (age && kind && name) {
          let newPet = {};
          newPet.age = parseInt(age);
          newPet.kind = kind;
          newPet.name = name;
          pets.push(newPet);
          console.log(newPet);
        }
        else {
          console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
          process.exit(1);
        }

        var petsJSON = JSON.stringify(pets);

        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                throw writeErr;
            }
        });
    });
}
else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf-8', function(readErr, data){
    if (readErr) {
      throw readErr;
    }

    var pets = JSON.parse(data);
    var index = process.argv[3];
    var age = process.argv[4];
    var kind = process.argv[5];
    var name = process.argv[6];

    if (index && age && kind && name) {
      if (index >= pets.length || index < 0) {
          console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      }
      else {
        let newPet = {};
        newPet.age = parseInt(age);
        newPet.kind = kind;
        newPet.name = name;
        pets[index] = newPet;
        console.log(newPet);
      }
    }
    else {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
        if (writeErr) {
            throw writeErr;
        }
    });
  });
}
else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf-8', function(readErr, data){
    if (readErr) {
      throw readErr;
    }

    let pets = JSON.parse(data);
    let index = process.argv[3];

    if (index) {
      if (index >= pets.length || index < 0) {
          console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
          process.exit(1);
      }
      else {
        console.log(pets.splice(index, 1)[0]);
      }
    }
    else {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    var petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
        if (writeErr) {
            throw writeErr;
        }
    });
  });
}
else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exit(1);
}
