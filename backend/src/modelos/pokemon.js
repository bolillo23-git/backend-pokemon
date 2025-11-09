const mongoose = require("mongoose");

const pokemonEsquema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    nivel: {
        type: Number,
        required: true,
        min: 1
    },
    imagen: {
        type: String,
        required: false
    },
    entrenador: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('pokemon', pokemonEsquema);
