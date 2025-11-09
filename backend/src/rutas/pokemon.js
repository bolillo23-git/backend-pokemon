const express = require("express");
const router = express.Router();
const Pokemon = require("../modelos/pokemon");

// crear pokemon
router.post("/", async (req, res) => {
  try {
    const { nombre, tipo, nivel, imagen, entrenador } = req.body;
    if (!entrenador) return res.status(400).json({ message: "Falta el nombre del entrenador" });

    // Limita a 6 Pokémon por entrenador
    const count = await Pokemon.countDocuments({ entrenador });
    if (count >= 6) return res.status(400).json({ message: "Equipo completo (6 Pokémon máximo)" });

    const nuevoPokemon = new Pokemon({ nombre, tipo, nivel, imagen, entrenador });
    const saved = await nuevoPokemon.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//consultar a todos o por entranador
router.get("/", async (req, res) => {
  try {
    const { entrenador } = req.query;
    const filtro = entrenador ? { entrenador } : {};
    const data = await Pokemon.find(filtro);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// consultat por id
router.get("/:id", async (req, res) => {
  try {
    const data = await Pokemon.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Pokémon no encontrado" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// actualiza pokemon
router.put("/:id", async (req, res) => {
  try {
    const { nombre, tipo, nivel, imagen } = req.body;
    const existing = await Pokemon.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Pokémon no encontrado" });

    await Pokemon.updateOne(
      { _id: req.params.id },
      { $set: { nombre, tipo, nivel, imagen } }
    );

    res.json({ message: "Pokémon actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// eliminar pokemon
router.delete("/:id", async (req, res) => {
  try {
    const existing = await Pokemon.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Pokémon no encontrado" });

    await Pokemon.findByIdAndDelete(req.params.id);
    res.json({ message: "Pokémon eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
