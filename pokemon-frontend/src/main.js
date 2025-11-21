// ==========================================
// CONFIGURACIÓN
// ==========================================
const API_URL = "https://backend-pokemon-wv6b.onrender.com/api";

// ELEMENTOS DEL DOM
const formPokemon = document.getElementById("formPokemon");
const tablaPokemon = document.getElementById("tablaPokemon");

const modalError = new bootstrap.Modal(document.getElementById("modalError"));
const mensajeError = document.getElementById("mensajeError");

const editarModal = new bootstrap.Modal(document.getElementById("modalEditar"));
const editarId = document.getElementById("editarId");
const editarNombre = document.getElementById("editarNombre");
const editarTipo = document.getElementById("editarTipo");
const editarNivel = document.getElementById("editarNivel");
const editarImagen = document.getElementById("editarImagen");

const eliminarModal = new bootstrap.Modal(document.getElementById("modalEliminar"));
const nombreEliminar = document.getElementById("nombreEliminar");
const confirmarEliminar = document.getElementById("confirmarEliminar");

const selectPokemon = document.getElementById("nombre");
const tipoInput = document.getElementById("tipo");
const nivelInput = document.getElementById("nivel");
const entrenadorInput = document.getElementById("entrenador");

const filtroInput = document.getElementById("filtro");

// ==========================================
// POKÉMON DISPONIBLES PARA SELECCIONAR
// ==========================================
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

// ==========================================
// LLENAR SELECT DE POKÉMON
// ==========================================
pokemons.forEach(p => {
    const option = document.createElement("option");
    option.value = p.nombre;
    option.textContent = p.nombre;
    selectPokemon.appendChild(option);

    const optionEdit = option.cloneNode(true);
    editarNombre.appendChild(optionEdit);
});

// Cambiar tipo automáticamente al seleccionar
selectPokemon.addEventListener("change", e => {
    const seleccionado = pokemons.find(p => p.nombre === e.target.value);
    tipoInput.value = seleccionado ? seleccionado.tipo : "";
});

// Cambiar campos al editar
editarNombre.addEventListener("change", e => {
    const seleccionado = pokemons.find(p => p.nombre === e.target.value);
    editarTipo.value = seleccionado ? seleccionado.tipo : "";
    editarImagen.value = seleccionado ? seleccionado.imagen : "";
});

// ==========================================
// FUNCIÓN PARA RENDERIZAR TABLA
// ==========================================
async function renderEquipo(entrenador = "") {
    try {
        const url = entrenador ? `${API_URL}?entrenador=${entrenador}` : API_URL;
        const res = await fetch(url);
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
                    <button class="btn btn-warning btn-sm" data-id="${p._id}" 
                            data-bs-toggle="modal" data-bs-target="#modalEditar">Editar</button>
                    <button class="btn btn-danger btn-sm" data-id="${p._id}" 
                            data-nombre="${p.nombre}"
                            data-bs-toggle="modal" data-bs-target="#modalEliminar">Eliminar</button>
                </td>
            `;
            tablaPokemon.appendChild(fila);
        });

    } catch (err) {
        console.error(err);
    }
}

// ==========================================
// VALIDACIÓN + AGREGAR POKÉMON
// ==========================================
formPokemon.addEventListener("submit", async e => {
    e.preventDefault();

    // Activar validación Bootstrap
    formPokemon.classList.add("was-validated");

    if (!formPokemon.checkValidity()) {
        return;
    }

    const nombre = selectPokemon.value;
    const tipo = tipoInput.value;
    const nivel = parseInt(nivelInput.value);
    const entrenador = entrenadorInput.value;

    const pokemon = pokemons.find(p => p.nombre === nombre);

    const nuevoPokemon = {
        entrenador,
        nombre,
        tipo,
        nivel,
        imagen: pokemon.imagen
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoPokemon)
        });

        const data = await res.json();

        if (!res.ok) {
            mensajeError.textContent = data.message;
            modalError.show();
            return;
        }

        await renderEquipo();
        formPokemon.reset();
        formPokemon.classList.remove("was-validated");

    } catch (err) {
        mensajeError.textContent = "Error de conexión";
        modalError.show();
    }
});

// ==========================================
// VALIDACIÓN DEL FILTRO
// ==========================================
filtroInput.addEventListener("input", () => {
    filtroInput.classList.add("was-validated");

    renderEquipo(filtroInput.value.trim());
});

// ==========================================
// EDITAR Y ELIMINAR (DELEGACIÓN DE EVENTOS)
// ==========================================
tablaPokemon.addEventListener("click", async e => {

    // ---- EDITAR ----
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

    // ---- ELIMINAR ----
    if (e.target.classList.contains("btn-danger")) {
        const id = e.target.dataset.id;
        const nombre = e.target.dataset.nombre;

        confirmarEliminar.dataset.id = id;
        nombreEliminar.textContent = nombre;
        eliminarModal.show();
    }
});

// ==========================================
// CONFIRMAR ELIMINACIÓN
// ==========================================
confirmarEliminar.addEventListener("click", async () => {
    const id = confirmarEliminar.dataset.id;

    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        eliminarModal.hide();
        renderEquipo();

    } catch (err) {
        mensajeError.textContent = "No se pudo eliminar";
        modalError.show();
    }
});

// ==========================================
// CARGAR LA TABLA AL INICIO
// ==========================================
renderEquipo();
