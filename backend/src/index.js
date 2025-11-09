const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require("dotenv").config();

const rutaPokemon = require('./rutas/pokemon');

const app = express();
const port = process.env.PORT || 9000;

app.use(cors({ origin: "*" }));


// Middleware
app.use(express.json());
app.use('/api', rutaPokemon);

// Ruta principal
app.get('/', (req, res) => {
    res.send("Bienvenido a la API de tu equipo Pokémon ");
});

// Conexión a MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
    .catch((error) => console.error('Error de conexión:', error));

app.listen(port, () => console.log('Servidor funcionando en puerto', port));
