const express = require('express');

// Inicia o API
const app = express();
const port = 3000;

// usar json
app.use(express.json());

// definir rotas
app.use('/api', require('./src/users.js'));
app.use('/api', require('./src/menu.js'));

app.listen(port, () => console.log(`Funfando na porta ${port}`));

