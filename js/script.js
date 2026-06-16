
const supervisor = {
    user: "",
    pass: "",
    rol: "supervisor"
};

const operador = {
    rol: "operador"
};

const categoriasBase = [
    "Bespoke",
    "Diamond",
    "Diamond Seg.",
    "Platinium",
    "Gold",
    "Classic",
    "No socios"
];

let usuarioActual = operador;


let clientes = JSON.parse(localStorage.getItem("clientes")) || [

    {
        id: "1001",
        nombre: "Juan Pérez",
        dni: "30111222",
        categoria: "Diamond",
        patente: "AB123CD",
        foto: "/img/foto1.PNG",
        acompanante: {
            nombre: "María López",
            dni: "28999888",
            categoria: "Acompañante",
            foto: "/img/foto2.PNG"
        },
        enVip: true,
        historial: [],
        novedades: []
    }
];

const formulario = document.getElementById("form-busqueda");
const buscador = document.getElementById("buscador");
const resultadoCliente = document.getElementById("resultado-cliente");
const panelDinamico = document.getElementById("panel-dinamico");
const panelEstadisticas = document.getElementById("panel-estadisticas");
const btnExportar = document.getElementById("btn-exportar");
const btnImportar = document.getElementById("btn-importar");
const inputImportar = document.getElementById("input-importar");
const btnMetricas = document.getElementById("btn-metricas");

btnMetricas.addEventListener("click", () => {

    vistaActual = "metricas";

    resultadoCliente.style.display = "none";
    panelEstadisticas.style.display = "block";

    cambiarVista("metricas");

    renderEstadisticas();
});


document.getElementById("fechaDesde")
    .addEventListener("change", () => {
        console.log("CAMBIO DESDE");

        panelEstadisticas.style.display = "block";
        resultadoCliente.style.display = "none";

        renderEstadisticas();
    });

document.getElementById("fechaHasta")
    .addEventListener("change", () => {
        console.log("CAMBIO HASTA");

        panelEstadisticas.style.display = "block";
        resultadoCliente.style.display = "none";

        renderEstadisticas();
    });

const panelNuevo = document.getElementById("panel-nuevo");
const btnNuevo = document.getElementById("btn-nuevo");
const btnSupervisor = document.getElementById("btn-supervisor");
const btnLogout = document.getElementById("btn-logout");
const panelAdmin = document.getElementById("panel-admin");


let clienteActual = null;
let vistaActual = "historial";

let categoriaExpandida = null;


function getEnSalaAhora() {

    const resultado = {
        total: 0,
        acompanantes: 0,
        categorias: {}
    };

    categoriasBase.forEach(cat => {
        resultado.categorias[cat] = 0;
    });

    clientes.forEach(cliente => {

        if (!cliente.enVip) return;

        resultado.total++;

        if (cliente.acompanante?.ingresa) {
            resultado.acompanantes++;
        }

        const categoria = cliente.categoria;

        if (resultado.categorias.hasOwnProperty(categoria)) {
            resultado.categorias[categoria]++;
        } else {
            resultado.categorias["No socios"]++;
        }
    });

    return resultado;
}

function getClientesEnSalaPorCategoria() {

    const resultado = {};

    categoriasBase.forEach(cat => {
        resultado[cat] = [];
    });

    resultado["No socios"] = [];

    clientes.forEach(cliente => {

        if (!cliente.enVip) return;

        const categoria =
            cliente.categoria || "No socios";

        if (!resultado[categoria]) {
            resultado[categoria] = [];
        }

        resultado[categoria].push({
            id: cliente.id,
            nombre: cliente.nombre,
            apellido: cliente.apellido
        });
    });

    return resultado;
}

function iniciarApp() {
    volverInicio();
}

iniciarApp();



function guardarClientes() {
    localStorage.setItem("clientes", JSON.stringify(clientes));

}

function actualizarVistaUsuario() {

    const panelAdmin = document.getElementById("panel-admin");
    const btnLogout = document.getElementById("btn-logout");
    const btnSupervisor = document.getElementById("btn-supervisor");
    const controlesHistorico = document.getElementById("controles-historico");

    if (!panelAdmin || !btnLogout || !controlesHistorico) return;

    if (usuarioActual.rol === "supervisor") {

        panelAdmin.style.display = "block";

        if (btnSupervisor) {
            btnSupervisor.style.display = "none";
        }

        btnLogout.style.display = "block";
        controlesHistorico.style.display = "flex";

    } else {

        panelAdmin.style.display = "none";

        if (btnSupervisor) {
            btnSupervisor.style.display = "block";
        }

        btnLogout.style.display = "none";
        controlesHistorico.style.display = "none";
    }


}


//CATEGORIAS PARA METRICAS//

function getMetricasCategoria() {

    const categorias = {};

    clientes.forEach(c => {
        categorias[c.categoria] = (categorias[c.categoria] || 0) + 1;
    });

    return categorias;
}

function calcularMovimientosPorHora(historial) {

    const movimientos = {};

    historial.forEach(evento => {

        const e = normalizarEvento(evento);
        if (!e) return;

        const fecha = new Date(e.fecha);
        const hora = fecha.getHours();

        if (!movimientos[hora]) {
            movimientos[hora] = {
                hora,
                ingresos: 0,
                egresos: 0
            };
        }

        if (e.tipo === "INGRESO") {
            movimientos[hora].ingresos++;
        }

        if (e.tipo === "EGRESO") {
            movimientos[hora].egresos++;
        }
    });

    return Object.values(movimientos)
        .sort((a, b) => a.hora - b.hora);
}


function getFlujoOperativo(clientes) {

    let ingresosSocios = 0;
    let ingresosAcompanantes = 0;
    let egresosSocios = 0;
    let egresosAcompanantes = 0;

    clientes.forEach(c => {

        if (!c.historial) return;

        c.historial.forEach(evento => {

            if (evento.tipo === "INGRESO") {
                ingresosSocios++;
            }

            if (evento.tipo === "EGRESO") {
                egresosSocios++;
            }

            if (evento.tipo === "INGRESO") {
                ingresosAcompanantes++;
            }

            if (evento.tipo === "EGRESO") {
                egresosAcompanantes++;
            }
        });
    });

    return {
        ingresosSocios,
        ingresosAcompanantes,
        egresosSocios,
        egresosAcompanantes
    };
}


function getMovimientosHoy() {

    let ingresos = 0;
    let egresos = 0;

    const ingresosCategoria = {};
    const egresosCategoria = {};

    const hoy = new Date().toDateString();

    clientes.forEach(cliente => {

        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));

            if (isNaN(fecha.getTime())) return;

            if (fecha.toDateString() !== hoy) return;

            const categoria = cliente.categoria || "Sin categoría";

            if (mov.tipo?.includes("INGRESO")) {

                ingresos++;

                ingresosCategoria[categoria] =
                    (ingresosCategoria[categoria] || 0) + 1;
            }

            if (
                mov.tipo?.includes("EGRESO") ||
                mov.tipo?.includes("SALIO")
            ) {

                egresos++;

                egresosCategoria[categoria] =
                    (egresosCategoria[categoria] || 0) + 1;
            }
        });

    });

    return {
        ingresos,
        egresos,
        ingresosCategoria,
        egresosCategoria
    };

}

function getMovimientoDiarioPorCategoria() {

    const resultado = {};

    categoriasBase.forEach(cat => {
        resultado[cat] = {
            ingresos: 0,
            egresos: 0
        };
    });

    clientes.forEach(cliente => {

        const categoria = cliente.categoria || "No socios";

        (cliente.historial || []).forEach(evento => {

            const e = normalizarEvento(evento);
            if (!e) return;

            const fecha = new Date(e.fecha);

            if (isNaN(fecha.getTime())) return;

            const hora = fecha.getHours();

            // Jornada operativa 06:00 -> 06:00
            const fechaOperativa = new Date(fecha);

            if (hora < 6) {
                fechaOperativa.setDate(
                    fechaOperativa.getDate() - 1
                );
            }

            if (!resultado[categoria]) {
                resultado[categoria] = {
                    ingresos: 0,
                    egresos: 0
                };
            }

            if (e.tipo === "INGRESO") {
                resultado[categoria].ingresos++;
            }

            if (e.tipo === "EGRESO") {
                resultado[categoria].egresos++;
            }

        });
    });

    return resultado;
}



function getMetricasTurno() {

    let manana = 0;
    let tarde = 0;
    let noche = 0;

    clientes.forEach(cliente => {
        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const hora = fecha.getHours();

            if (hora >= 6 && hora <= 13) manana++;
            else if (hora >= 14 && hora <= 20) tarde++;
            else noche++;
        });
    });

    return { manana, tarde, noche };
}


function getActividadPorHora(lista = clientes) {

    const horas = Array(24).fill(0);

    lista.forEach(cliente => {
        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const hora = fecha.getHours();
            horas[hora]++;
        });
    });

    return horas;
}


function getMovimientosFiltradosPorFecha(lista = clientes) {

    const desde = document.getElementById("fechaDesde").value;
    const hasta = document.getElementById("fechaHasta").value;

    if (!desde || !hasta) {

        return lista.flatMap(c =>
            (c.historial || []).map(mov => ({
                ...mov,
                clienteId: c.id,
                categoria: c.categoria
            }))
        );
    }

    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    fechaHasta.setHours(23, 59, 59, 999);

    let movimientos = [];

    lista.forEach(cliente => {
        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            if (fecha >= fechaDesde && fecha <= fechaHasta) {
                movimientos.push({
                    ...mov,
                    clienteId: cliente.id,
                    categoria: cliente.categoria
                });
            }
        });
    });

    return movimientos;
}


function getClientesPorHoraCategoria(lista = clientes) {

    const resultado = {};

    lista.forEach(cliente => {

        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const hora = fecha.getHours();
            const categoria = cliente.categoria || "Sin categoría";

            if (!resultado[hora]) {
                resultado[hora] = {};
            }

            resultado[hora][categoria] =
                (resultado[hora][categoria] || 0) + 1;
        });
    });

    return resultado;
}



//PANELES DE CONTROL//

// =====================
// FIX COMPATIBILIDAD UI
// =====================

// alias crítico (esto rompía el click en métricas)
function seleccionarCategoria(cat) {
    toggleCategoria(cat);
}

// =====================
// FIX SEGURIDAD RENDER METRICAS
// =====================

function safeNumber(n) {
    return isNaN(n) || !isFinite(n) ? 0 : n;
}

// =====================
// FIX getClientesEnSalaPorCategoria
// =====================

function getClientesEnSalaPorCategoria() {

    const resultado = {};

    categoriasBase.forEach(cat => {
        resultado[cat] = [];
    });

    resultado["No socios"] = [];

    clientes.forEach(cliente => {

        if (!cliente.enVip) return;

        const categoria = cliente.categoria || "No socios";

        if (!resultado[categoria]) {
            resultado[categoria] = [];
        }

        resultado[categoria].push({
            id: cliente.id,
            nombre: cliente.nombre,
            apellido: cliente.apellido || "" // FIX: evita crash
        });
    });

    return resultado;
}

// =====================
// FIX RENDER ESTADISTICAS
// =====================

function renderEstadisticas() {

    if (!panelEstadisticas) return;

    const clientesFiltrados = getClientesFiltradosPorFecha();

    const enSala = getEnSalaAhora();
    const clientesEnSala = getClientesEnSalaPorCategoria();

    const movimientoDiario = getMovimientoDiarioPorCategoria();
    const cruce = getMetricasCruce(clientesFiltrados);

    const horas = getActividadPorHora(clientesFiltrados || []);

    const maxHora = safeNumber(Math.max(...horas, 1));

    panelEstadisticas.innerHTML = `

<div class="dashboard">

    <!-- EN SALA -->
    <div class="card metric-card full">
        <h5>EN SALA AHORA</h5>

        <div class="fila-cruce">
            <strong>Socios</strong>
            <span>${enSala.total}</span>
        </div>

        <div class="fila-cruce">
            <strong>Acompañantes</strong>
            <span>${enSala.acompanantes}</span>
        </div>

        <hr>
        

        ${Object.entries(enSala.categorias || {}).map(([cat, total]) => `
            <div class="fila-cruce categoria-click ${categoriaExpandida === cat ? "categoria-activa" : ""}"
    onclick="toggleCategoria('${cat}')">
    <strong>${cat}</strong>
    <span>${total}</span>
</div>

            ${categoriaExpandida === cat ? `

    <div class="lista-categoria">

        ${(clientesEnSala[cat] || [])
                .filter(c => c && c.nombre)
                .map(cliente => `
            <div class="cliente-en-sala"
    onclick="abrirCliente('${cliente.id}')"
    style="cursor:pointer;"
>
    ${cliente.nombre || ""} ${cliente.apellido || ""}
</div>
            `).join("")}

    </div>

` : ""}

        `).join("")}
    </div>

    <!-- MOVIMIENTO DIARIO -->
    <div class="card metric-card">
        <h5>MOVIMIENTO DIARIO</h5>
        <small>Jornada 06:00 → 06:00</small>
        <hr>

        <div class="fila-cruce encabezado">
            <strong>Categoría</strong>
            <span>Ingreso</span>
            <span>Egreso</span>
        </div>

        ${Object.entries(movimientoDiario || {}).map(([categoria, datos]) => `
            <div class="fila-cruce">
                <strong>${categoria}</strong>
                <span>${datos.ingresos}</span>
                <span>${datos.egresos}</span>
            </div>
        `).join("")}
    </div>


<!-- CRUCE -->
<div class="card metric-card full">
    <h5>CATEGORÍA × TURNO</h5>

    <div class="fila-cruce encabezado">
        <strong>Categoría</strong>
        <span>M</span>
        <span>T</span>
        <span>N</span>
    </div>

    ${Object.entries(cruce || {}).map(([categoria, valores]) => `
        <div class="fila-cruce">
            <strong>${categoria}</strong>
            <span>${valores.manana}</span>
            <span>${valores.tarde}</span>
            <span>${valores.noche}</span>
        </div>
    `).join("")}
</div>

<!-- GRAFICO -->
<div class="card metric-card grafico-principal">
    <h5>ACTIVIDAD POR HORA</h5>

    <div class="chart">
        ${(horas || []).map((h, i) => `
            <div class="bar">
                <div class="fill" style="height:${(safeNumber(h) / maxHora) * 100}px"></div>
                <small>${i}</small>
            </div>
        `).join("")}
    </div>
</div>
</div>
`;
}

function getMetricasCruce(lista = clientes) {

    const metricas = {

        "Bespoke": {
            manana: 0,
            tarde: 0,
            noche: 0
        },
        "Diamond": {
            manana: 0,
            tarde: 0,
            noche: 0
        },
        "Diamond Seg.": {
            manana: 0,
            tarde: 0,
            noche: 0
        },
        "Platinium": {
            manana: 0,
            tarde: 0,
            noche: 0
        },
        "Gold": {
            manana: 0,
            tarde: 0,
            noche: 0
        },
        "Classic": {
            manana: 0,
            tarde: 0,
            noche: 0
        },

        "No socios": {
            manana: 0,
            tarde: 0,
            noche: 0
        }
    };

    lista.forEach(cliente => {

        const categoria = cliente.categoria || "Sin categoría";
        const turno = cliente.turno?.toLowerCase();

        if (!metricas[categoria]) {
            metricas[categoria] = {
                manana: 0,
                tarde: 0,
                noche: 0
            };
        }

        if (turno && metricas[categoria][turno] !== undefined) {
            metricas[categoria][turno]++;
        }

    });

    return metricas;
}

function getMetricasPorDia(lista = clientes) {

    const dias = {};

    lista.forEach(cliente => {
        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const dia = fecha.toISOString().split("T")[0]; // YYYY-MM-DD

            dias[dia] = (dias[dia] || 0) + 1;
        });
    });

    return dias;
}



//FRANJAS HORARIAS//

function obtenerFranja(fechaTexto) {

    const fecha = new Date(fechaTexto);

    if (isNaN(fecha)) return;

    const hora = fecha.getHours();

    if (hora >= 6 && hora <= 13) return "Mañana";
    if (hora >= 14 && hora <= 20) return "Tarde";

    return "Noche";
}

function getMetricasPorMes(lista = clientes) {

    const meses = {};

    lista.forEach(cliente => {

        (cliente.historial || []).forEach(mov => {

            const fecha = new Date(Number(mov.fecha));
            if (isNaN(fecha.getTime())) return;

            const mes =
                `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;

            meses[mes] = (meses[mes] || 0) + 1;
        });
    });

    return meses;
}

//ESTADISTICAS FILTRADAS//

function renderEstadisticasFiltradas(lista) {

    const total = lista.length;
    const enVip = lista.filter(c => c.enVip).length;

    panelEstadisticas.innerHTML = `
        <div class="card p-3">
            <h5>ESTADÍSTICAS FILTRADAS</h5>
            <p>Total: ${total}</p>
            <p>En VIP: ${enVip}</p>
        </div>
    `;
}

function getClientesFiltradosPorFecha() {

    const desde = document.getElementById("fechaDesde").value;
    const hasta = document.getElementById("fechaHasta").value;

    if (!desde || !hasta) return clientes;

    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);

    fechaHasta.setHours(23, 59, 59, 999);

    const resultado = clientes.filter(cliente =>
        cliente.historial?.some(registro => {

            const fecha = new Date(Number(registro.fecha));

            return fecha >= fechaDesde &&
                fecha <= fechaHasta;
        })
    );

    console.log("Clientes encontrados:", resultado.length);

    return resultado;
}



// BUSCADOR//


formulario.addEventListener("submit", function (e) {

    e.preventDefault();

    const valor = buscador.value.trim().toLowerCase();

    if (!valor) return;

    const resultados = clientes.filter(cliente => {

        const nombre = (cliente.nombre || "").toLowerCase();
        const dni = String(cliente.dni || "").toLowerCase();
        const id = String(cliente.id || "").toLowerCase();
        const tarjeta = String(cliente.tarjeta || "").toLowerCase();

        return (
            nombre.includes(valor) ||
            dni.includes(valor) ||
            id.includes(valor) ||
            tarjeta.includes(valor)
        );
    });

    if (resultados.length === 1) {

        clienteActual = resultados[0];
        vistaActual = "historial";
        cambiarVista("cliente");

    } else if (resultados.length > 1) {
        vistaActual = "lista";
        renderListaClientes(resultados);

    } else {

        resultadoCliente.innerHTML = `
            <div class="card p-3">
                <h5>Cliente no encontrado</h5>
            </div>
        `;
    }

    buscador.value = "";
});

function obtenerClaseCategoria(categoria) {

    if (categoria === "Bespoke") return "cat-bespoke";
    if (categoria === "Diamond") return "cat-diamond";
    if (categoria === "Diamond Seg.") return "cat-diamondseg";
    if (categoria === "Platinium") return "cat-platinium";
    if (categoria === "Gold") return "cat-gold";
    if (categoria === "Classic") return "cat-classic";
    if (categoria === "No Socios") return "cat-nosocios";

    return "";
}


// RENDER//


function renderCliente(cliente) {

    let html = `

    
<div class="zona-volver">
    <button class="btn btn-secondary btn-volver" onclick="volverMetricas()">
        Volver  
    </button>
</div>

<div class="clientes-wrapper">

    <article class="datos-contenedor">

        <b>CLIENTE</b>

        <div class="card ${cliente.enVip ? 'vip-activo' : ''} ${obtenerClaseCategoria(cliente.categoria)}" style="width: 18rem;">
            
            <div class="card-header">
                <button class="icon-btn" data-action="ver-foto-cliente">
    <i class="bi bi-camera-fill"></i>
</button>
            </div>

            <ul class="list-group list-group-flush">
                <li class="list-group-item">${cliente.nombre}</li>
                <li class="list-group-item">${cliente.dni}</li>
                <li class="list-group-item">${cliente.id}</li>
                <li class="list-group-item">${cliente.categoria}</li>
                <li class="list-group-item">${cliente.patente}</li>
            </ul>
        </div>

        <div class="acciones-card">

            <button data-action="ingreso" class="icon-btn">IN</button>
<button data-action="egreso" class="icon-btn">OUT</button>

            <button data-action="editar" class="icon-btn">
                <i class="bi bi-pencil"></i>
            </button>

            ${usuarioActual.rol === "supervisor"
            ? `<button data-action="eliminar" class="icon-btn">
                    <i class="bi bi-trash3"></i>
                </button>`
            : ""
        }

        </div>

    </article>
`;

    if (cliente.acompanante) {
        html += `
    <article class="datos-contenedor">

        <b>ACOMPAÑANTE</b>

        <div class="acompanante-item">

            <button class="icon-btn" data-action="ver-foto">
                <i class="bi bi-camera-fill"></i>
            </button>

            <span class="nombre-acompanante">
                ${cliente.acompanante.nombre}
            </span>

            <input 
type="checkbox" 
    data-action="toggle-acompanante"
    ${cliente.acompanante.ingresa ? "checked" : ""}
>

        </div>

    </article>
`;
    }

    html += `
    
<div id="panel-extra"></div>
`;

    resultadoCliente.innerHTML = html;
}


// RENDER PANEL (HISTORIAL / NOVEDADES)//

function renderPanel() {

    if (!clienteActual) return;

    const div = document.getElementById("panel-extra");

    if (vistaActual === "historial") {

        if (usuarioActual.rol !== "supervisor") {

            const ultimo = clienteActual.historial.at(-1);

            div.innerHTML = ultimo
                ? `
                <div class="card mt-2 p-3">
                    <h5>ÚLTIMO MOVIMIENTO</h5>
                    <p><strong>${ultimo.tipo}</strong></p>
                    <p>${ultimo.fecha}</p>
                </div>
            `
                : "<p>Sin movimientos del día</p>";

        } else {

            div.innerHTML = clienteActual.historial.length
                ? clienteActual.historial.slice().reverse().map(item => `
                <div class="card mt-2">
                    <div class="card-body">
                        <p><strong>${item.tipo}</strong></p>
                        <p>${item.fecha}</p>
                    </div>
                </div>
            `).join("")
                : "<p>Sin historial registrado</p>";
        }
    }

    if (vistaActual === "novedades") {

        div.innerHTML = clienteActual.novedades.length
            ? clienteActual.novedades.map(item => `
                <div class="card mt-2" style="width: 15rem;">
                    <div class="card-body">
                        <p>${item.texto}</p>
                        <p>${item.fecha}</p>
                    </div>
                </div>
            `).join("")
            : "<p>Sin novedades registradas</p>";
    }
}

function normalizarEvento(evento) {

    if (!evento) return null;

    // ya está en formato nuevo
    if (evento.subTipo) return evento;

    let tipo = evento.tipo;
    let subTipo = "SOCIO";

    if (tipo.includes("ACOMPAÑANTE")) {
        subTipo = "ACOMPANANTE";
        tipo = tipo.includes("EGRESO") ? "EGRESO" : "INGRESO";
    }

    if (tipo === "SALIO") {
        tipo = "EGRESO";
    }

    if (tipo === "ENTRO") {
        tipo = "INGRESO";
    }

    return {
        tipo,
        subTipo,
        fecha: evento.fecha
    };
}

//EVENTOS//

resultadoCliente.addEventListener("click", function (e) {

    const card = e.target.closest(".cliente-listado");

    if (card) {

        console.log("CLICK CLIENTE", card);

        const id = card.dataset.id;
        clienteActual = clientes.find(c => c.id === id);
        renderCliente(clienteActual);
        return;
    }

    if (!clienteActual) return;

    const action = e.target.closest("[data-action]")?.dataset.action;

    if (!action) return;


    if (action === "editar") {

        modoEdicion = true;
        clienteEditando = clienteActual;

        panelNuevo.innerHTML = `
    <div class="modal-edicion-overlay">
        <div class="modal-edicion">

            <h4>Editar cliente</h4>

            <input id="edit-nombre" class="form-control mb-2" value="${clienteActual.nombre}">
            <input id="edit-dni" class="form-control mb-2" value="${clienteActual.dni}">
            <input id="edit-email" class="form-control mb-2" value="${clienteActual.email || ""}">
            <input id="edit-celular" class="form-control mb-2" value="${clienteActual.celular || ""}">

            <div class="d-flex gap-2 justify-content-center">
                <button id="guardar-edicion" class="btn btn-warning">
                    Guardar
                </button>

                <button id="cancelar-edicion" class="btn btn-secondary">
                    Cancelar
                </button>
            </div>

        </div>
    </div>
`;
    }

    if (action === "ingreso") {

        if (tieneProhibicionActiva(clienteActual)) {
            alert("PROHIBICIÓN ACTIVA - COMUNICARSE CON JEFE VIP");
            registrarEventoCliente(clienteActual.id, "ALERTA_PROHIBICION", {
                motivo: "Prohibición activa detectada"
            });
            return;
        }

        clienteActual.enVip = true;

        registrarEventoCliente(clienteActual.id, "INGRESO");

        guardarClientes();
        renderCliente(clienteActual);
        renderEstadisticas();
        return;
    }

    if (action === "egreso") {

        registrarEventoCliente(clienteActual.id, "EGRESO");

        clienteActual.enVip = false;

        guardarClientes();
        renderCliente(clienteActual);
        renderEstadisticas();
        return;
    }

    if (action === "historial") {
        vistaActual = "historial";
        renderPanel();
    }

    if (action === "novedades") {

        const texto = prompt("Escribí la novedad:");
        if (!texto) return;

        clienteActual.novedades.push({
            texto,
            fecha: Date.now()
        });

        guardarClientes();
        vistaActual = "novedades";
        renderPanel();
    }

    if (action === "toggle-acompanante") {
        clienteActual.acompanante.ingresa = e.target.checked;
        guardarClientes();
        return;
    }

    if (action === "eliminar") {

        const confirmar = confirm("¿Seguro que querés eliminar este cliente?");

        if (!confirmar) return;

        // eliminar del array
        clientes = clientes.filter(c => c.id !== clienteActual.id);

        // guardar en storage
        guardarClientes();

        // 3. limpiar estado 
        clienteActual = null;

        // volver a inicio limpio
        volverInicio();
    }

    if (action === "ver-foto-cliente") {

        const boton = e.target.closest("button");

        boton.innerHTML = `
        <img 
            src="${clienteActual.foto}" 
            style="
                width:110px;
                height:110px;
                object-fit:cover;
                border-radius:50%;
                border:3px solid #daa520;
            ">
    `;

        boton.style.background = "transparent";
        boton.style.border = "none";
        boton.style.width = "120px";
        boton.style.height = "120px";

        setTimeout(() => {
            boton.innerHTML = `<i class="bi bi-camera-fill"></i>`;
            boton.style.width = "";
            boton.style.height = "";
            boton.style.background = "";
            boton.style.border = "";
        }, 4000);
    }



    if (action === "ver-foto") {

        const boton = e.target.closest("button");

        boton.innerHTML = `
        <img 
            src="${clienteActual.acompanante.foto}" 
            style="
                width:110px;
                height:110px;
                object-fit:cover;
                border-radius:50%;
                border:3px solid #daa520;
            ">
    `;

        boton.style.background = "transparent";
        boton.style.border = "none";
        boton.style.width = "120px";
        boton.style.height = "120px";

        setTimeout(() => {
            boton.innerHTML = `<i class="bi bi-camera-fill"></i>`;
            boton.style.width = "";
            boton.style.height = "";
            boton.style.background = "";
            boton.style.border = "";
        }, 4000);
    }

});


function volverInicio() {

    clienteActual = null;
    vistaActual = "inicio";

    panelNuevo.innerHTML = "";
    panelNuevo.classList.add("oculto");

    panelEstadisticas.style.display = "none";

    resultadoCliente.style.display = "block";

    resultadoCliente.innerHTML = `
        <div id="pantalla-espera">
            <img src="img/Logo-ingreso.jpeg" class="logo">
            <h1 id="reloj-digital"></h1>
            <p id="fecha-digital"></p>
        </div>
    `;

    actualizarReloj();
}


function actualizarReloj() {

    const ahora = new Date();

    const hora = ahora.toLocaleTimeString("es-AR", {
        hour12: false
    });
    const fecha = ahora.toLocaleDateString("es-AR");

    const reloj = document.getElementById("reloj-digital");
    const fechaTexto = document.getElementById("fecha-digital");

    if (reloj) reloj.textContent = hora;
    if (fechaTexto) fechaTexto.textContent = fecha;
}


function renderListaClientes(lista) {

    resultadoCliente.innerHTML = lista.map(cliente => `
        <div class="card mt-2 p-2 cliente-listado"
            data-id="${cliente.id}"
            style="cursor:pointer;">
            <strong>${cliente.nombre}</strong>
            <p>${cliente.categoria}</p>
        </div>
    `).join("");

    vistaActual = "lista";
    clienteActual = null;
}


function toggleCategoria(cat) {

    if (categoriaExpandida === cat) {
        categoriaExpandida = null;
    } else {
        categoriaExpandida = cat;
    }

    renderEstadisticas();
}

document.addEventListener("click", function (e) {

    if (e.target.id === "btn-volver-categorias") {
        categoriaExpandida = null;
        renderEstadisticas();
        renderListaClientes(clientes);
    }
});


// =====================
// SUPERVISOR LOGIN 
// =====================

document.addEventListener("DOMContentLoaded", function () {

    const btnSupervisor = document.getElementById("btn-supervisor");

    if (!btnSupervisor) return;

    btnSupervisor.addEventListener("click", function () {
        document.getElementById("login-supervisor").classList.remove("oculto");
    });

    const btnOk = document.getElementById("btn-login-ok");
    const btnCancel = document.getElementById("btn-login-cancel");

    if (btnOk) {
        btnOk.addEventListener("click", function () {

            const pass = document.getElementById("input-pass").value;

            if (pass === supervisor.pass) {
                usuarioActual = supervisor;
                actualizarVistaUsuario();

                document.getElementById("login-supervisor").classList.add("oculto");
            } else {
                alert("Contraseña incorrecta");
            }
        });
    }

    if (btnCancel) {
        btnCancel.addEventListener("click", function () {
            document.getElementById("login-supervisor").classList.add("oculto");
        });
    }
});


// =====================
// ABRIR CLIENTE 
// =====================

function abrirCliente(id) {

    const cliente = clientes.find(c => c.id === id);

    if (!cliente) return;

    clienteActual = cliente;
    vistaActual = "cliente";

    // render primero (estado seguro)
    renderCliente(clienteActual);

    // luego cambio de vista
    document.getElementById("panel-estadisticas").style.display = "none";
    resultadoCliente.style.display = "block";
}



function volverMetricas() {

    resultadoCliente.style.display = "none";
    panelEstadisticas.style.display = "block";

    renderEstadisticas();
}

//DESLOGUEO//

btnLogout.addEventListener("click", function () {

    usuarioActual = operador;

    clienteActual = null;
    vistaActual = "inicio";

    panelNuevo.innerHTML = "";
    panelNuevo.classList.add("oculto");

    panelEstadisticas.style.display = "none";

    resultadoCliente.style.display = "block";

    volverInicio();

    actualizarVistaUsuario();
});

actualizarVistaUsuario();
setInterval(actualizarReloj, 1000);

resultadoCliente.innerHTML = `
    <div id="pantalla-espera">
        <img src="img/Logo-ingreso.jpeg" class="logo">
        <h1 id="reloj-digital"></h1>
        <p id="fecha-digital"></p>
    </div>
`;

//RELOJ//

actualizarReloj();

btnExportar.addEventListener("click", function () {

    const datos = JSON.stringify(clientes, null, 2);

    const blob = new Blob([datos], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "backup-clientes.json";

    a.click();

    URL.revokeObjectURL(url);
});

btnImportar.addEventListener("click", function () {
    inputImportar.click();
});

inputImportar.addEventListener("change", function (e) {

    const archivo = e.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function (evento) {

        clientes = JSON.parse(evento.target.result);

        guardarClientes();

        volverInicio();
    };

    lector.readAsText(archivo);
});

btnNuevo.addEventListener("click", function () {

    resultadoCliente.innerHTML = "";
    clienteActual = null;

    panelNuevo.classList.remove("oculto");

    panelNuevo.innerHTML = `
        <div class="card p-4">
            <h4>Nuevo ingreso</h4>

            <input id="nuevo-nombre" class="form-control mb-2" placeholder="Apellido y nombre">

            <input id="nuevo-dni" class="form-control mb-2" placeholder="DNI">

            <input id="nuevo-email" class="form-control mb-2" placeholder="Email">

            <input id="nuevo-celular" class="form-control mb-2" placeholder="Celular">

            <div class="mb-3">
                <label>
                    <input type="checkbox" id="chk-pesos"> Pesos
                </label>

                <label class="ms-3">
                    <input type="checkbox" id="chk-dolares"> Dólares
                </label>
            </div>

            <button id="guardar-nuevo" class="btn btn-success">
                Guardar cliente
            </button>
        </div>
    `;
});

document.addEventListener("click", function (e) {


    // =====================
    // CREAR CLIENTE
    // =====================

    if (e.target.id === "guardar-nuevo") {

        const nombre = document.getElementById("nuevo-nombre").value.trim();
        const dni = document.getElementById("nuevo-dni").value.trim();
        const email = document.getElementById("nuevo-email").value.trim();
        const celular = document.getElementById("nuevo-celular").value.trim();

        const pesos = document.getElementById("chk-pesos").checked;
        const dolares = document.getElementById("chk-dolares").checked;

        if (!nombre || !dni) {
            alert("Nombre y DNI son obligatorios");
            return;
        }
        const clienteExistente = clientes.find(c => c.dni === dni);

        if (clienteExistente) {
            alert("Ese cliente ya existe");
            return;
        }

        const nuevoCliente = {
            id: "NS" + Date.now(),
            nombre: nombre,
            dni: dni,
            email: email,
            celular: celular,
            categoria: "No Socios",
            moneda: {
                pesos: pesos,
                dolares: dolares
            },
            foto: "/img/foto1.PNG",
            enVip: false,
            historial: [],
            novedades: []
        };


        clientes.push(nuevoCliente);

        guardarClientes();

        panelNuevo.innerHTML = "";
        panelNuevo.classList.add("oculto");

        alert("Cliente creado correctamente");
        volverInicio();
    }
});


// =====================
// EDITAR CLIENTE
// =====================


document.addEventListener("click", function (e) {

    if (e.target.id === "guardar-edicion") {

        const nombre = document.getElementById("edit-nombre").value.trim();
        const dni = document.getElementById("edit-dni").value.trim();
        const email = document.getElementById("edit-email").value.trim();
        const celular = document.getElementById("edit-celular").value.trim();

        // actualizar clienteActual
        clienteActual.nombre = nombre;
        clienteActual.dni = dni;
        clienteActual.email = email;
        clienteActual.celular = celular;

        // actualizar en el array 
        const index = clientes.findIndex(c => c.id === clienteActual.id);

        if (index !== -1) {
            clientes[index] = { ...clienteActual };
        }

        // guardar en storage
        guardarClientes();

        // limpiar panel
        panelNuevo.innerHTML = "";
        panelNuevo.classList.add("oculto");

        // re-render seguro
        renderCliente(clienteActual);
    }
});

document.addEventListener("click", function (e) {

    if (e.target.id === "cancelar-edicion") {
        panelNuevo.innerHTML = "";
        panelNuevo.classList.add("oculto");
    }
});

function cambiarVista(vista) {

    vistaActual = vista;

    // ocultar todo
    resultadoCliente.style.display = "none";
    panelEstadisticas.style.display = "none";

    if (vista === "lista") {
        resultadoCliente.style.display = "block";
        renderListaClientes(clientes);
    }

    if (vista === "metricas") {
        panelEstadisticas.style.display = "block";
        renderEstadisticas();
    }

    if (vista === "cliente" && clienteActual) {
        resultadoCliente.style.display = "block";
        renderCliente(clienteActual);
    }
}

// =====================
// EVENT SYSTEM CORE
// =====================

function crearEvento(tipo, datos = {}) {

    return {
        tipo,                      // INGRESO | EGRESO | EDICION | TARJETA | NOVEDAD
        fecha: Date.now(),
        operador: usuarioActual?.rol || "operador",
        ...datos
    };
}

function registrarEventoCliente(clienteId, tipo, datos = {}) {

    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) return;

    const evento = crearEvento(tipo, datos);

    if (!cliente.historial) {
        cliente.historial = [];
    }

    cliente.historial.push(evento);

    guardarClientes();

    return evento;
}