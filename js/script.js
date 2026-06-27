
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
        tarjeta: "AB123CD",
        foto: "/img/foto1.PNG",
        acompanantes: [
            {
                nombre: "María López",
                dni: "28999888",
                categoria: "Acompañante",
                foto: "/img/foto2.PNG"
            }
        ],
        enVip: true,
        historial: [],
        novedades: []
    }
];

clientes.forEach(cliente => {

    if (!cliente.acompanantes) {

        cliente.acompanantes = [];

        if (cliente.acompanante) {
            cliente.acompanantes.push(cliente.acompanante);
        }
    }

});



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
const anioMinimo = 2026;
const mesMinimoPorAnio = 6; 


let clienteActual = null;
let vistaActual = "historial";
let modoCrearNovedad = false;
let anioHistorialSeleccionado = "2026";
let mesHistorialSeleccionado = "06";

let categoriaExpandida = null;
let acompananteEditIndex = null;

let accionPendiente = null;


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

function abrirModalConfirmacion(titulo, mensaje, callback) {

    const modal = document.getElementById("modal-confirmacion");
    const tituloEl = document.getElementById("modal-titulo");
    const textoEl = document.getElementById("modal-texto");
    const btnSi = document.getElementById("btn-modal-confirmar");
    const btnNo = document.getElementById("btn-modal-cancelar");

    tituloEl.textContent = titulo;
    textoEl.textContent = mensaje;

    modal.classList.remove("oculto");

    const cb = callback;

    btnSi.onclick = () => {
        modal.classList.add("oculto");
        btnSi.onclick = null;
        btnNo.onclick = null;
        modal.onclick = null;
        if (cb) cb(true);
    };

    btnNo.onclick = () => {
        modal.classList.add("oculto");
        btnSi.onclick = null;
        btnNo.onclick = null;
        modal.onclick = null;
        if (cb) cb(false);
    };

    modal.onclick = (e) => {
        if (e.target !== modal) return;
        modal.classList.add("oculto");
        btnSi.onclick = null;
        btnNo.onclick = null;
        modal.onclick = null;
        if (cb) cb(false);
    };
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
            apellido: cliente.apellido || ""
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
        <small>Jornada 06:00 hs → 06:00 hs</small>
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

        const normalizar = (texto) =>
            String(texto || "")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();

        const termino = normalizar(valor);

        const textoBusqueda = normalizar(`
    ${cliente.nombre}
    ${cliente.dni}
    ${cliente.id}
    ${cliente.tarjeta}
`);

        return textoBusqueda.includes(termino);
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

    console.log("ROL ACTUAL:", usuarioActual.rol);

    let html = `


<div class="clientes-wrapper">

    <article class="datos-contenedor">

        <b>CLIENTE</b>

        <div class="card ficha-cliente ${cliente.enVip ? 'vip-activo' : ''} ${obtenerClaseCategoria(cliente.categoria)}">
            
            <div class="card-header">
                <button class="icon-btn" data-action="ver-foto-cliente">
    <i class="bi bi-camera-fill"></i>
</button>
            </div>

            <ul class="list-group list-group-flush">
                <li class="list-group-item">
    Nombre: ${cliente.nombre}
</li>

<li class="list-group-item">
    DNI: ${cliente.dni}
</li>

<li class="list-group-item">
    ID: ${cliente.id}
</li>

<li class="list-group-item">
    Tarjeta: ${cliente.tarjeta || "-"}
</li>

<li class="list-group-item">
    Categoría: ${cliente.categoria}
</li>

<li class="list-group-item estado-cliente">
    Autoexclusión:
    ${cliente.autoexclusion?.activa ? "ACTIVA" : "NO"}
</li>

<li class="list-group-item estado-cliente">
    Prohibición:
    ${cliente.prohibicion?.activa ? "ACTIVA" : "NO"}
</li>

<li class="list-group-item acciones-ficha">

    <button
        class="btn btn-outline-dark"
        data-action="historial">
        Historial
    </button>

    <button
        class="btn btn-outline-dark"
        data-action="novedades">
        Novedades
    </button>

</li>
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

    const acompanantes = cliente.acompanantes || [];

    html += `
<article class="datos-contenedor">

    <div style="margin-bottom:10px;">
        <button class="btn btn-sm btn-outline-primary" data-action="agregar-acompanante">
            Agregar acompañante
        </button>
    </div>
`;

    if (acompanantes.length === 0) {

        html += `<div class="text-muted">Sin acompañantes</div>`;

    } else {

        acompanantes.slice(0, 2).forEach((a, index) => {

            html += `

<div class="acompanante-item ficha-acompanante">

    <button class="icon-btn"
        data-action="ver-foto-acompanante"
        data-index="${index}">
        <i class="bi bi-camera-fill"></i>
    </button>

    <div>
        <strong>${a.nombre}</strong>
    </div>

    <div>
        DNI: ${a.dni}
    </div>

    <div class="acciones-acompanante">

        <button
            class="btn-editar-acomp"
            data-action="editar-acompanante"
            data-index="${index}">
            <i class="bi bi-pencil"></i>
        </button>

        <button
            class="btn-eliminar-acomp"
            data-action="eliminar-acompanante"
            data-index="${index}">
            <i class="bi bi-trash"></i>
        </button>

    </div>

</div>`;
        });
    }

    html += `

<div id="form-acompanante-dinamico"
    style="display:none; margin-top:10px; border:1px solid #daa520; padding:10px; border-radius:8px; text-align:center;">

    <input type="text" id="acomp-nombre" placeholder="Nombre y apellido" class="form-control mb-2">

    <input type="text" id="acomp-dni" placeholder="DNI" class="form-control mb-2">

    <div class="mb-2">

    <img
        id="preview-acomp"
        src="/img/logo-foto.png"
        style="
            width:80px;
            height:80px;
            border-radius:50%;
            object-fit:cover;
            cursor:pointer;
            border:2px solid #daa520;
        ">

    <input
    type="file"
    id="acomp-foto"
    accept="image/*"
    style="position:absolute; left:-9999px;">

</div>

    <button
    data-action="guardar-acompanante"
    class="btn btn-dorado">
    Guardar
    </button>

</div>
</article>
`;

    html += `
</div>


<div id="panel-extra"></div>

<div class="zona-volver">
    <button
        class="btn btn-secondary btn-volver"
        onclick="volverMetricas()">
        Volver
    </button>
</div>

`;

    resultadoCliente.innerHTML = html;
}

const preview = document.getElementById("preview-acomp");

if (preview) {

    preview.addEventListener("click", function () {

        document
            .getElementById("acomp-foto")
            ?.click();

    });
}


// RENDER PANEL (HISTORIAL / NOVEDADES)//

function formatearFecha(ts) {
    const d = new Date(ts);

    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();

    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${hora}:${min} hs.`;
}


function formatearHora(ts) {

    const d = new Date(ts);

    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');

    return `${hora}:${min} hs.`;
}

function agruparHistorial(historial) {

    const dias = {};

    historial.forEach(item => {

        const fechaObj = new Date(item.fecha);
        const key = fechaObj.toLocaleDateString("es-AR");

        if (!dias[key]) {
            dias[key] = {
                fecha: key,
                visitas: [],
                acompanantes: 0
            };
        }

        if (item.tipo === "INGRESO") {
            dias[key].visitas.push({
                ingreso: item.fecha,
                egreso: null
            });
        }

        if (item.tipo === "EGRESO") {
            const visitas = dias[key].visitas;

            for (let i = visitas.length - 1; i >= 0; i--) {
                if (visitas[i].egreso === null) {
                    visitas[i].egreso = item.fecha;
                    break;
                }
            }
        }
    });

    return Object.values(dias).sort((a, b) => {
    return new Date(a.fecha.split('/').reverse().join('-')) -
            new Date(b.fecha.split('/').reverse().join('-'));
});
}

function renderPanel() {


    if (!clienteActual) return;

    const div = document.getElementById("panel-extra");


    /* ================= HISTORIAL ================= */


if (vistaActual === "historial") {

    const historialFiltrado = clienteActual.historial.filter(item => {
        const fecha = new Date(item.fecha);

        return (
            String(fecha.getMonth() + 1).padStart(2, "0") === mesHistorialSeleccionado &&
            String(fecha.getFullYear()) === anioHistorialSeleccionado
        );
    });

    const historialAgrupado = agruparHistorial(historialFiltrado)
    .map(dia => ({
        ...dia,
        visitas: dia.visitas.filter(v => v.ingreso && v.egreso)
    }))
    .filter(dia => dia.visitas.length > 0);

    

        const contenidoHistorial = `
            <div class="d-flex justify-content-center align-items-center gap-2 mb-3">

                <button
                    onclick="anioHistorialSeleccionado=String(Number(anioHistorialSeleccionado)-1);renderPanel();"
                    style="all:unset; cursor:pointer; font-size:28px; color:#d4af37; padding:0 12px;">
                    −
                </button>

                <div class="px-3 py-2 border border-warning rounded text-warning fw-bold fs-4">
                    ${anioHistorialSeleccionado}
                </div>

                <button
                    onclick="anioHistorialSeleccionado=String(Number(anioHistorialSeleccionado)+1);renderPanel();"
                    style="all:unset; cursor:pointer; font-size:28px; color:#d4af37; padding:0 12px;">
                    +
                </button>

            </div>

            ${
                historialAgrupado.length > 0
                    ? `
                        <div class="row g-2">
                            ${historialAgrupado.map(dia => `
                                <div class="col-12 col-md-3">
                                    <div class="card h-100">
                                        <div class="card-body" style="color:#d4af37; display:flex; flex-direction:column; gap:6px; text-align:center;">

                                            <div style="font-weight:bold; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:4px;">
                                                ${dia.fecha}
                                            </div>

                                            <div>
                                                ${dia.visitas
                                                    .filter(v => v.egreso)
                                                    .map(v => `
                                                        <div style="padding:2px 0;">
                                                            ${formatearHora(v.ingreso)} → ${formatearHora(v.egreso)}
                                                        </div>
                                                    `).join("")}
                                            </div>

                                            ${(clienteActual.categoria === "Diamond" || clienteActual.categoria === "Bespoke") && dia.acompanantes > 0 ? `
                                                <div style="margin-top:6px; font-size:0.9em; opacity:0.9;">
                                                    Acompañante${dia.acompanantes > 1 ? "s" : ""}: ${dia.acompanantes}
                                                </div>
                                            ` : ""}

                                        </div>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    `
                    : `
                        <div class="alert alert-secondary text-center">
    No existen registros para el período seleccionado
</div>
                    `
            }
        `;

        div.innerHTML = contenidoHistorial;
    }



    /* ================= NOVEDADES ================= */

    else if (vistaActual === "novedades") {

        const novedades = clienteActual.novedades || [];

        let html = `
            <div class="d-flex align-items-center gap-1 mb-2">
                <h5 class="m-0">Novedades</h5>

                <button class="btn btn-warning fw-bold"
                        data-action="agregar-novedad"
                        style="width:24px;height:24px;padding:0;">
                    +
                </button>
            </div>
    `;


        if (modoCrearNovedad) {

            html += `
        <div class="card mb-2"
            style="border:1px solid #d4af37;border-radius:10px;background:#fff;overflow:hidden;">

        <textarea id="input-novedad" class="novedad-textarea" placeholder="Escribí la novedad..."></textarea>

        <div class="p-2">

            <div class="novedad-footer">

    <div class="contador-novedad" id="contador-novedad">
        0/50 
    </div>

    <div class="novedad-actions">

        <button data-action="guardar-edicion-novedad" class="icon-btn">
    <i class="bi bi-floppy"></i>
</button>

<button data-action="cancelar-edicion-novedad" class="icon-btn">
    <i class="bi bi-x-lg"></i>
</button>

    </div>

</div>

            </div>

        </div>

    </div>
`;
        }

        if (novedades.length > 0) {

            html += novedades
                .slice()
                .sort((a, b) => b.fecha - a.fecha)
                .map(item => `
                    <div class="card mt-2">
                        <div class="card-body d-flex justify-content-between align-items-center">

                            <div>
                                <small style="color:#d4af37;">
                                    ${formatearFecha(item.fecha)}
                                </small>

                                <p class="mb-0" style="color:#d4af37;">
                                    ${item.texto}
                                </p>
                            </div>

                            <div>

                                <div class="d-flex gap-2">

    <button data-action="ver-novedad"
            data-fecha="${item.fecha}"
            class="icon-btn">
        <i class="bi bi-eye"></i>
    </button>

    ${usuarioActual.rol === "supervisor" ? `
        <button data-action="editar-novedad"
                data-fecha="${item.fecha}"
                class="icon-btn">
            <i class="bi bi-pencil"></i>
        </button>

        <button data-action="eliminar-novedad"
                data-fecha="${item.fecha}"
                class="icon-btn">
            <i class="bi bi-trash3"></i>
        </button>` : ""}

</div>

                            </div>
                        </div>
                    </div>

                `).join("");
        } else {
            html += `<p class="text-muted">Sin novedades registradas</p>`;
        }
        div.innerHTML = html;


        if (modoCrearNovedad) {

            const textarea = document.getElementById("input-novedad");
            const contador = document.getElementById("contador-novedad");

            textarea?.addEventListener("input", () => {

                const palabras = textarea.value
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);

                contador.textContent =
                    `${palabras.length} / 50 palabras`;
            });
        }
    }

    /* ================= VER NOVEDAD ================= */


    else if (vistaActual === "ver-novedad") {


        const esSupervisor = usuarioActual.rol === "supervisor";

        const fechaNovedad = new Date(novedadSeleccionada.fecha);

        const fechaFormateada =
            fechaNovedad.toLocaleDateString("es-AR") +
            " " +
            fechaNovedad.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }) +
            " hs.";

        div.innerHTML = `
            <div class="card mt-2" style="border-radius:10px; overflow:hidden;">
                <div class="card-body p-3" style="position:relative;">

                    <button class="btn btn-sm btn-warning"
                            style="position:absolute; top:10px; right:10px;"
                            data-action="volver-novedades">
                        ✖
                    </button>

                    <small class="d-block mb-2"
                        style="color:#d4af37; font-weight:500;">
                        ${fechaFormateada}
                    </small>

                    ${!modoEdicionNovedad ? `
    <p class="mb-0" style="color:#d4af37;">
        ${novedadSeleccionada.texto || ""}
    </p>
` : `
    <textarea id="input-novedad" class="novedad-textarea">${novedadSeleccionada.texto || ""}</textarea>

    <small id="contador-novedad" class="d-block text-center" style="color:#d4af37;">0 / 50 palabras</small>
`}

                    <div class="mt-3 d-flex justify-content-center gap-2">

                        ${esSupervisor && modoEdicionNovedad ? `
                            <button class="btn btn-warning btn-sm"
                                    data-action="guardar-edicion-novedad">
                                Guardar
                            </button>
                        ` : ""}

                    </div>

                </div>
            </div>
        `;
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

        console.log("CLICK EDITAR");

        panelNuevo.classList.remove("oculto");

        panelNuevo.innerHTML = `
    <div class="modal-edicion-overlay">
        <div class="modal-edicion">

            <h4>Editar cliente</h4>

            <div class="mb-2">
    <label>Nombre y Apellido</label>
    <input
        id="edit-nombre"
        class="form-control"
        value="${clienteActual.nombre}">
</div>

<div class="mb-2">
    <label>DNI</label>
    <input
        id="edit-dni"
        class="form-control"
        value="${clienteActual.dni}">
</div>

<div class="mb-2">
    <label>ID Cliente</label>
    <input
        id="edit-id"
        class="form-control"
        value="${clienteActual.id}"
        ${usuarioActual.rol !== "supervisor" ? "readonly" : ""}>
</div>

<div class="mb-2">
    <label>Número de Tarjeta</label>
    <input
        id="edit-tarjeta"
        class="form-control"
        value="${clienteActual.tarjeta || ""}">
</div>

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

    document.addEventListener("click", function (e) {

        const boton = e.target.closest("[data-action]");

        if (!boton) return;

        const action = boton.getAttribute("data-action");

        if (action === "historial") {
            vistaActual = "historial";
            renderPanel();
        }

        if (action === "agregar-novedad") {
            modoCrearNovedad = true;
            console.log("modoCrearNovedad:", modoCrearNovedad);
            renderPanel();
        }


        if (action === "novedades") {
            vistaActual = "novedades";
            renderPanel();

        }

        if (action === "guardar-novedad") {

            const texto = document.getElementById("input-novedad")?.value.trim();

            if (!texto) return;

            clienteActual.novedades.push({
                texto,
                fecha: Date.now()
            });

            guardarClientes();

            modoCrearNovedad = false;
            renderPanel();
        }


        if (action === "cancelar-novedad") {
            modoCrearNovedad = false;
            renderPanel();
        }

        if (action === "ver-novedad") {

            const fecha = Number(boton.getAttribute("data-fecha"));

            const index = clienteActual.novedades.findIndex(
                n => n.fecha === fecha
            );

            if (index === -1) return;

            novedadSeleccionada = clienteActual.novedades[index];
            indexNovedadSeleccionada = index;

            modoEdicionNovedad = false;
            vistaActual = "ver-novedad";

            renderPanel();
        }

        if (action === "volver-novedades") {
            vistaActual = "novedades";
            renderPanel();
        }

        if (action === "editar-novedad") {

            const fecha = Number(boton.getAttribute("data-fecha"));

            const index = clienteActual.novedades.findIndex(
                n => n.fecha === fecha
            );

            if (index === -1) return;

            novedadSeleccionada = clienteActual.novedades[index];
            indexNovedadSeleccionada = index;

            modoEdicionNovedad = true;
            vistaActual = "ver-novedad";

            renderPanel();

            if (action === "editar-novedad") {

                const fecha = Number(boton.getAttribute("data-fecha"));

                const index = clienteActual.novedades.findIndex(
                    n => n.fecha === fecha
                );

                if (index === -1) return;

                novedadSeleccionada = clienteActual.novedades[index];
                indexNovedadSeleccionada = index;

                modoEdicionNovedad = true;
                vistaActual = "ver-novedad";

                setTimeout(() => {
                    document.getElementById("input-novedad").value = novedadSeleccionada.texto || "";
                }, 0);

                renderPanel();
            }
        }


        if (action === "guardar-edicion-novedad") {

            const texto = document
                .getElementById("input-novedad")
                ?.value.trim();

            if (!texto) return;

            novedadSeleccionada.texto = texto;

            guardarClientes();

            modoEdicionNovedad = false;

            renderPanel();
        }

        if (action === "eliminar-novedad") {

            const fecha = Number(
                boton.getAttribute("data-fecha")
            );

            const index = clienteActual.novedades.findIndex(
                n => n.fecha === fecha
            );

            if (index === -1) return;

            abrirModalConfirmacion(
                "Eliminar novedad",
                "¿Desea eliminar esta novedad?",
                (confirmado) => {

                    if (!confirmado) return;

                    clienteActual.novedades.splice(index, 1);

                    guardarClientes();

                    renderPanel();
                }
            );
        }

    });

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
            src="${clienteActual.acompanantes[0].foto}" 
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


/* =========================
CLICK PRINCIPAL (ACCIONES)
========================= */

document.addEventListener("click", function (e) {

    const action = e.target.closest("[data-action]")?.dataset.action;

    /* VOLVER */
    if (e.target.id === "btn-volver-categorias") {
        categoriaExpandida = null;
        renderEstadisticas();
        renderListaClientes(clientes);
        return;
    }

    /* AGREGAR */
    if (action === "agregar-acompanante") {
        const form = document.getElementById("form-acompanante-dinamico");
        if (form) form.style.display = "block";
    }

    /* EDITAR */
    if (action === "editar-acompanante") {

        const boton = e.target.closest("[data-index]");
        if (!boton) return;

        const index = parseInt(boton.dataset.index);

        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        const clienteIndex = clientes.findIndex(c => c.id == clienteActual.id);

        if (clienteIndex === -1) return;

        const acomp = clientes[clienteIndex].acompanantes[index];
        if (!acomp) return;

        acompananteEditIndex = index;

        document.getElementById("acomp-nombre").value = acomp.nombre;
        document.getElementById("acomp-dni").value = acomp.dni;

        const form = document.getElementById("form-acompanante-dinamico");
        if (form) form.style.display = "block";

        clienteActual = clientes[clienteIndex];
    }

    if (action === "ver-foto-acompanante") {

        const index = parseInt(
            e.target.closest("[data-index]")?.dataset.index
        );

        if (isNaN(index)) return;

        const acomp = clienteActual.acompanantes[index];

        if (!acomp?.foto) return;

        const boton = e.target.closest("button");

        boton.innerHTML = `
        <img
            src="${acomp.foto}"
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

            boton.innerHTML =
                `<i class="bi bi-camera-fill"></i>`;

            boton.style.width = "";
            boton.style.height = "";
            boton.style.background = "";
            boton.style.border = "";

        }, 4000);
    }

    /* ELIMINAR */
    if (action === "eliminar-acompanante") {

        const index = parseInt(
            e.target.closest("[data-index]")?.dataset.index
        );

        if (isNaN(index)) return;

        abrirModalConfirmacion(
            "Eliminar acompañante",
            "¿Desea eliminar este acompañante?",
            (confirmado) => {

                if (!confirmado) return;

                clienteActual.acompanantes.splice(index, 1);

                guardarClientes();
                renderCliente(clienteActual);
            }
        );

        return;
    }

    /* GUARDAR */
    if (action === "guardar-acompanante") {

        const nombre = document.getElementById("acomp-nombre").value.trim();
        const dni = document.getElementById("acomp-dni").value.trim();
        const fileInput = document.getElementById("acomp-foto");

        if (!nombre || !dni) return;

        const file = fileInput.files[0];

        const procesarGuardado = (fotoBase64 = "") => {

            if (!clienteActual.acompanantes) {
                clienteActual.acompanantes = [];
            }

            if (acompananteEditIndex !== null) {

                clienteActual.acompanantes[acompananteEditIndex].nombre = nombre;
                clienteActual.acompanantes[acompananteEditIndex].dni = dni;

                if (fotoBase64) {
                    clienteActual.acompanantes[acompananteEditIndex].foto = fotoBase64;
                }

                acompananteEditIndex = null;

            } else {

                if (clienteActual.acompanantes.length >= 2) return;

                clienteActual.acompanantes.push({
                    nombre,
                    dni,
                    foto: fotoBase64
                });
            }

            guardarClientes();
            renderCliente(clienteActual);

            document.getElementById("acomp-nombre").value = "";
            document.getElementById("acomp-dni").value = "";
            document.getElementById("acomp-foto").value = "";

            document.getElementById("form-acompanante-dinamico").style.display = "none";
        };

        if (file) {

            const reader = new FileReader();

            reader.onload = function (e) {
                procesarGuardado(e.target.result);
            };

            reader.readAsDataURL(file);

        } else {

            procesarGuardado("");
        }
    }

});


/* =========================
CLICK FUERA (CERRAR FORM)
========================= */

document.addEventListener("click", function (e) {

    const form = document.getElementById("form-acompanante-dinamico");
    if (!form) return;

    const isInside = form.contains(e.target);
    const isActionButton =
        e.target.closest("[data-action='agregar-acompanante']") ||
        e.target.closest("[data-action='editar-acompanante']");

    if (!isInside && !isActionButton) {
        form.style.display = "none";
        acompananteEditIndex = null;
    }
});


/* =========================
INPUT CLEAN
========================= */

document.addEventListener("input", function (e) {

    if (e.target.id === "acomp-nombre") {
        e.target.style.border = "";
    }

    if (e.target.id === "acomp-dni") {
        e.target.style.border = "";
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

document
    .getElementById("btn-modal-cancelar")
    .addEventListener("click", () => {

        document
            .getElementById("modal-confirmacion")
            .classList.add("oculto");

        accionPendiente = null;
    });

document
    .getElementById("btn-modal-confirmar")
    .addEventListener("click", () => {

        if (accionPendiente) {
            accionPendiente();
        }

        document
            .getElementById("modal-confirmacion")
            .classList.add("oculto");

        accionPendiente = null;
    });

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
            novedades: [],
            acompanantes: []
        };


        clientes.push(nuevoCliente);

        guardarClientes();

        panelNuevo.innerHTML = "";
        panelNuevo.classList.add("oculto");

        alert("Cliente creado correctamente");
        volverInicio();
    }


    // =====================
    // EDITAR CLIENTE
    // =====================


    if (e.target.id === "guardar-edicion") {

        if (!clienteActual) return;

        const nombre = document.getElementById("edit-nombre").value.trim();
        const dni = document.getElementById("edit-dni").value.trim();
        const idCliente = document.getElementById("edit-id").value.trim();
        const tarjeta = document.getElementById("edit-tarjeta").value.trim();

        if (!nombre || !dni) {
            alert("Nombre y DNI son obligatorios");
            return;
        }

        clienteActual.nombre = nombre;
        clienteActual.dni = dni;
        clienteActual.tarjeta = tarjeta;

        if (usuarioActual.rol === "supervisor") {
            clienteActual.id = idCliente;
        }

        const index = clientes.findIndex(c => c.id === clienteActual.id);

        if (index !== -1) {
            clientes[index] = { ...clienteActual };
        }

        guardarClientes();

        panelNuevo.innerHTML = "";
        panelNuevo.classList.add("oculto");

        renderCliente(clienteActual);
    }


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


function tieneProhibicionActiva(cliente) {
    return false;
}


/*ICONO DE IMAGEN DEL ACOMPAÑANTE*/

document.addEventListener("click", (e) => {
    console.log("CLICK EN:", e.target);
});

document.addEventListener("click", (e) => {

    const preview = e.target.closest("#preview-acomp");

    if (!preview) return;

    const input = document.getElementById("acomp-foto");

    if (!input) return;

    input.click();
});