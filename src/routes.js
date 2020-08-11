const express = require('express');
const routes = express.Router();
// const bodyParser = require('body-parser');
const uuid = require('uuid').v4;
const fs = require('fs');

// DataBase
let usersDB;
fs.readFile('./src/users.json', (err, data) => {
  // se o arquivo estiver completamente vazio preencha com array vazio []
  if (data === null || data == "") data = "[]";

  if (err) {
    // const { code } = err;
    // console.log(code); 
    // if (code === 'ENOENT') {
    //   fs.writeFile('./src/users.json', "[]", (error) => {
    //     if (error) throw error; 
    //     console.log('File created');
    //   });
    // };
    throw err;
  };

  usersDB = (JSON.parse(data));
  //  console.log(usersDB); 
});

// GET
routes.get('/users', (req, res) => {
  res.json(usersDB);
});

// GET ID
routes.get('/users/:id', (req, res) => {
  const user = usersDB.find(u => u.id === req.params.id);

  res.json(user);
});

// POST
routes.post('/users', (req, res) => {
  const body = req.body;

  // criar novo usuario
  let newUser = {
    id: uuid(),
    ...body
  };

  // adicionar usuario
  usersDB.push(newUser);

  // salva no arquivo
  saveFileDB(usersDB);

  // resposta para o POST
  res.json(newUser);
});

// PATCH
routes.patch('/users/:id', (req, res) => {
  const index = usersDB.indexOf(usersDB.find(u => u.id === req.params.id));
  const userPartialUpdate = usersDB.find(u => u.id === req.params.id);
  const body = req.body;

  // atualiza parte usuario
  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      userPartialUpdate[key] = body[key];
    }
  }

  // adicionar usuario atualizado
  usersDB.splice(index, 1, userPartialUpdate);

  // salva no arquivo
  saveFileDB(usersDB);

  // resposta para o POST
  res.json(userPartialUpdate);
});

// PUT
routes.put('/users/:id', (req, res) => {
  const index = usersDB.indexOf(usersDB.find(u => u.id === req.params.id));
  const body = req.body;

  // atualizar usuario
  let updateUser = {
    id: req.params.id,
    ...body
  };

  // adicionar usuario atualizado
  usersDB.splice(index, 1, updateUser);

  saveFileDB(usersDB);

  res.json(updateUser);
});

// DELETE
routes.delete('/users/:id', (req, res) => {
  const index = usersDB.indexOf(usersDB.find(u => u.id === req.params.id));

  usersDB.splice(index, 1);

  // salva no arquivo
  saveFileDB(usersDB);

  res.json('User deleted');
});

// ATUALIZA BD PERSISTENTE
const saveFileDB = (db) => {
  // salva no arquivo
  fs.writeFile('./src/users.json', JSON.stringify(db), (err) => {
    if (err) throw err;
    console.log('File saved')
  });
};

module.exports = routes;