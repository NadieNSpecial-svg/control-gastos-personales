// Paso 3. Seleccionar elementos del DOM y guardarlos en constantes
const formGasto = document.getElementById("form-gasto");
const inputDescripcion = document.getElementById("descripcion");
const inputValor = document.getElementById("valor");
const selectCategoria = document.getElementById("categoria");

const errorDescripcion = document.getElementById("error-descripcion");
const errorValor = document.getElementById("error-valor");
const errorCategoria = document.getElementById("error-categoria");

const filtroCategoria = document.getElementById("filtro-categoria");
const listaGastos = document.getElementById("lista-gastos");
const totalGastosElemento = document.getElementById("total-gastos");

const PRESUPUESTO_MAXIMO = 500000;

// Paso 4 y 9. Arreglo de gastos y lectura en localStorage al iniciar
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

// Función para guardar en localStorage
function guardarEnLocalStorage() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

// Función principal de Renderizado (Paso 4, 6, 7 y 8)
function render() {
  // Limpiar tabla antes de redibujar
  listaGastos.textContent = "";

  const categoriaFiltrada = filtroCategoria.value;

  // Filtrar los gastos según la categoría seleccionada
  const gastosFiltrados = gastos.filter((gasto) => {
    if (categoriaFiltrada === "Todas") return true;
    return gasto.categoria === categoriaFiltrada;
  });

  let total = 0;

  // Construir filas usando estrictamente createElement y textContent
  gastosFiltrados.forEach((gasto) => {
    total += gasto.valor;

    const tr = document.createElement("tr");

    const tdDescripcion = document.createElement("td");
    tdDescripcion.textContent = gasto.descripcion;

    const tdCategoria = document.createElement("td");
    tdCategoria.textContent = gasto.categoria;

    const tdValor = document.createElement("td");
    // Formato moneda colombiana COP
    tdValor.textContent = `$ ${gasto.valor.toLocaleString("es-CO")}`;

    const tdAccion = document.createElement("td");
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.dataset.id = gasto.id;

    tdAccion.appendChild(btnEliminar);

    tr.appendChild(tdDescripcion);
    tr.appendChild(tdCategoria);
    tr.appendChild(tdValor);
    tr.appendChild(tdAccion);

    listaGastos.appendChild(tr);
  });

  // Paso 7. Actualizar total y alerta de presupuesto con classList
  totalGastosElemento.textContent = `$ ${total.toLocaleString("es-CO")}`;

  if (total > PRESUPUESTO_MAXIMO) {
    totalGastosElemento.classList.add("supera-presupuesto");
  } else {
    totalGastosElemento.classList.remove("supera-presupuesto");
  }
}

// Limpiar mensajes de error del formulario
function limpiarErrores() {
  errorDescripcion.textContent = "";
  errorValor.textContent = "";
  errorCategoria.textContent = "";
}

// Paso 5. Evento Submit con validación y registro de gasto
formGasto.addEventListener("submit", (e) => {
  e.preventDefault();
  limpiarErrores();

  let esValido = true;

  const descripcionVal = inputDescripcion.value.trim();
  const valorVal = parseFloat(inputValor.value);
  const categoriaVal = selectCategoria.value;

  // Validación de campos vacíos y número positivo sin alert()
  if (descripcionVal === "") {
    errorDescripcion.textContent = "La descripción es obligatoria.";
    esValido = false;
  }

  if (isNaN(valorVal) || valorVal <= 0) {
    errorValor.textContent = "El valor debe ser un número mayor a cero.";
    esValido = false;
  }

  if (categoriaVal === "") {
    errorCategoria.textContent = "Debe seleccionar una categoría.";
    esValido = false;
  }

  if (!esValido) return;

  // Crear objeto de gasto
  const nuevoGasto = {
    id: Date.now(),
    descripcion: descripcionVal,
    valor: valorVal,
    categoria: categoriaVal,
  };

  gastos.push(nuevoGasto);
  guardarEnLocalStorage();
  render();

  // Limpiar formulario tras registro exitoso
  formGasto.reset();
});

// Paso 6. Eliminación de gastos usando Delegación de Eventos en el tbody (listaGastos)
listaGastos.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-eliminar")) {
    const idAEliminar = Number(e.target.dataset.id);
    gastos = gastos.filter((gasto) => gasto.id !== idAEliminar);
    guardarEnLocalStorage();
    render();
  }
});

// Paso 8. Evento del Filtro por Categoría
filtroCategoria.addEventListener("change", () => {
  render();
});

// Carga inicial
render();
