const API_URL = "https://backend-pokemon-wv6b.onrender.com/api";

const formPokemon = document.getElementById("formPokemon");
const tablaPokemon = document.getElementById("tablaPokemon");
const editarModal = new bootstrap.Modal(document.getElementById("modalEditar"));
const eliminarModal = new bootstrap.Modal(document.getElementById("modalEliminar"));

// NUEVO MODAL ERROR
const modalError = new bootstrap.Modal(document.getElementById("modalError"));
const mensajeError = document.getElementById("mensajeError");

const editarId = document.getElementById("editarId");
const editarNombre = document.getElementById("editarNombre");
const editarTipo = document.getElementById("editarTipo");
const editarNivel = document.getElementById("editarNivel");
const editarImagen = document.getElementById("editarImagen");

const nombreEliminar = document.getElementById("nombreEliminar");
const confirmarEliminar = document.getElementById("confirmarEliminar");

const selectPokemon = document.getElementById("nombre");
const tipoInput = document.getElementById("tipo");
const nivelInput = document.getElementById("nivel");
const entrenadorInput = document.getElementById("entrenador");

// === LISTA DE POKÉMON BÁSICA ===
const pokemons = [
  { nombre: "Pikachu", tipo: "Eléctrico", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
  { nombre: "Charmander", tipo: "Fuego", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { nombre: "Squirtle", tipo: "Agua", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
  { nombre: "Bulbasaur", tipo: "Planta", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { nombre: "Eevee", tipo: "Normal", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png" },
  { nombre: "Jigglypuff", tipo: "Hada", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png" },
  { nombre: "Snorlax", tipo: "Normal", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" },
  { nombre: "Mewtwo", tipo: "Psíquico", imagen: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" }
];

// === CARGAR POKÉMON EN SELECT ===
pokemons.forEach(p => {
  const option = document.createElement("option");
  option.value = p.nombre;
  option.textContent = p.nombre;
  selectPokemon.appendChild(option);

  const optionEdit = option.cloneNode(true);
  editarNombre.appendChild(optionEdit);
});

// === ACTUALIZAR TIPO AUTOMÁTICO ===
selectPokemon.addEventListener("change", e => {
  const seleccionado = pokemons.find(p => p.nombre === e.target.value);
  tipoInput.value = seleccionado ? seleccionado.tipo : "";
});

editarNombre.addEventListener("change", e => {
  const seleccionado = pokemons.find(p => p.nombre === e.target.value);
  editarTipo.value = seleccionado ? seleccionado.tipo : "";
  editarImagen.value = seleccionado ? seleccionado.imagen : "";
});

// === AGREGAR POKÉMON ===
formPokemon.addEventListener("submit", async e => {
  e.preventDefault();

  const nombre = selectPokemon.value;
  const tipo = tipoInput.value;
  const nivel = parseInt(nivelInput.value);
  const entrenador = entrenadorInput.value;

  if (!nombre || !tipo || !nivel || !entrenador) {
    mensajeError.textContent = "Completa todos los campos.";
    modalError.show();
    return;
  }

  const pokemon = pokemons.find(p => p.nombre === nombre);

  const nuevoPokemon = {
    entrenador,
    nombre,
    tipo,
    nivel,
    imagen: pokemon ? pokemon.imagen : ""
  };

  try {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPokemon)
    });

    const data = await res.json(); // capturar mensaje del backend

    if (!res.ok) {
      mensajeError.textContent = data.message || "Hubo un error al agregar el Pokémon";
      modalError.show();
      return;
    }

    await renderEquipo();
    formPokemon.reset();

  } catch (err) {
    console.error(err);
    mensajeError.textContent = "Error de conexión con el servidor";
    modalError.show();
  }
});

// === CARGAR TABLA ===
async function renderEquipo() {
  try {
    const res = await fetch(`${API_URL}`);
    const data = await res.json();

    tablaPokemon.innerHTML = "";

    data.forEach(p => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><img src="${p.imagen}" width="60" height="60" class="rounded-circle"></td>
        <td>${p.nombre}</td>
        <td>${p.tipo}</td>
        <td>${p.nivel}</td>
        <td>${p.entrenador}</td>
        <td>
          <button class="btn btn-warning btn-sm" data-id="${p._id}" data-bs-toggle="modal" data-bs-target="#modalEditar">Editar</button>
          <button class="btn btn-danger btn-sm" data-id="${p._id}" data-nombre="${p.nombre}" data-bs-toggle="modal" data-bs-target="#modalEliminar">Eliminar</button>
        </td>
      `;
      tablaPokemon.appendChild(fila);
    });
  } catch (err) {
    console.error("Error al obtener los equipos:", err);
  }
}

// === EDITAR ===
tablaPokemon.addEventListener("click", async e => {
  if (e.target.classList.contains("btn-warning")) {
    const id = e.target.dataset.id;
    const res = await fetch(`${API_URL}/${id}`);
    const pokemon = await res.json();

    editarId.value = id;
    editarNombre.value = pokemon.nombre;
    editarTipo.value = pokemon.tipo;
    editarNivel.value = pokemon.nivel;
    editarImagen.value = pokemon.imagen;

    editarModal.show();
  }

  if (e.target.classList.contains("btn-danger")) {
    const id = e.target.dataset.id;
    const nombre = e.target.dataset.nombre;

    confirmarEliminar.dataset.id = id;
    nombreEliminar.textContent = nombre;
    eliminarModal.show();
  }
});

// === GUARDAR CAMBIOS EDITAR ===
document.getElementById("guardarCambios").addEventListener("click", async () => {
  const id = editarId.value;
  const nombre = editarNombre.value;
  const tipo = editarTipo.value;
  const nivel = parseInt(editarNivel.value);
  const imagen = editarImagen.value;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo, nivel, imagen })
    });

    if (!res.ok) throw new Error("Error al actualizar Pokémon");

    editarModal.hide();
    await renderEquipo();
  } catch (err) {
    console.error(err);
    mensajeError.textContent = "No se pudo actualizar el Pokémon";
    modalError.show();
  }
});

// === ELIMINAR ===
confirmarEliminar.addEventListener("click", async () => {
  const id = confirmarEliminar.dataset.id;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar Pokémon");

    eliminarModal.hide();
    await renderEquipo();
  } catch (err) {
    console.error(err);
    mensajeError.textContent = "No se pudo eliminar el Pokémon";
    modalError.show();
  }
});

renderEquipo();
