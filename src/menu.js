const express = require('express');
const routes = express.Router();
// const bodyParser = require('body-parser');
const uuid = require('uuid').v4;
const fs = require('fs');

// DataBase
let menuDB;
fs.readFile('./src/menu.json', (err, data) => {
  // se o arquivo estiver completamente vazio preencha com array vazio []
  if (data === null || data == "") data = "[]";

  if (err) throw err;

  menuDB = (JSON.parse(data));
});

// GET
routes.get('/menu', (req, res) => {
  res.json(menuDB);
});

// GET ID
routes.get('/menu/:id', (req, res) => {
  const menu = menuDB.find(u => u.id === req.params.id);

  res.json(menu);
});

// POST
routes.post('/menu', (req, res) => {
  const body = req.body;

  // criar novo usuario
  let newMenu = {
    id: uuid(),
    ...body
  };

  // adicionar usuario
  menuDB.push(newMenu);

  // salva no arquivo
  saveFileDB(menuDB);

  // resposta para o POST
  res.json(newMenu);
});

// PATCH
routes.patch('/menu/:id', (req, res) => {
  const index = menuDB.indexOf(menuDB.find(m => m.id === req.params.id));

  // check if menu exists
  if (index === -1) {
    res.json('Menu not found');
    return;
  };

  const menuPartialUpdate = menuDB.find(m => m.id === req.params.id);
  const body = req.body;

  // atualiza parte usuario
  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      menuPartialUpdate[key] = body[key];
    }
  }

  // adicionar usuario atualizado
  menuDB.splice(index, 1, menuPartialUpdate);

  // salva no arquivo
  saveFileDB(menuDB);

  // resposta para o POST
  res.json(menuPartialUpdate);
});

// PUT
routes.put('/menu/:id', (req, res) => {
  const index = menuDB.indexOf(menuDB.find(m => m.id === req.params.id));

  // check if menu exists
  if (index === -1) {
    res.json('Menu not found');
    return;
  };

  const body = req.body;

  // atualizar usuario
  let updateMenu = {
    id: req.params.id,
    ...body
  };

  // adicionar usuario atualizado
  menuDB.splice(index, 1, updateMenu);

  saveFileDB(menuDB);

  res.json(updateMenu);
});

// DELETE
routes.delete('/menu/:id', (req, res) => {
  const index = menuDB.indexOf(menuDB.find(m => m.id === req.params.id));

  // check if menu exists
  if (index === -1) {
    res.json('Menu not found');
    return;
  };

  // delete menu
  menuDB.splice(index, 1);

  // salva no arquivo
  saveFileDB(menuDB);

  res.json('menu deleted');
});

// ATUALIZA BD PERSISTENTE
const saveFileDB = (db) => {
  // salva no arquivo
  fs.writeFile('./src/menu.json', JSON.stringify(db), (err) => {
    if (err) throw err;
    console.log('File saved')
  });
};

module.exports = routes;