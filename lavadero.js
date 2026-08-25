// lavadero.js
//
// Página independiente para el circuito de lavado de autos.
// No toca nada del sistema principal (script.js). Comparte la misma base
// de datos (Upstash) a través de api/clientes.js, api/lavados.js y api/personal.js.
//
// Se accede así:
//   lavadero.html                 -> vista cliente (default, la que escanea el QR)
//   lavadero.html?vista=lavador   -> vista para el personal que lava los autos
//
// La administración de personal, menú y mapa se mudó por completo a
// gastronomia.html?vista=admin — acceso conocido solo por el dueño del
// sistema, sin ningún enlace visible desde el resto de las pantallas.
//
// La autorización de pedidos ya no es una vista de esta página: se hace
// desde la campana de alertas del sistema principal (script.js).

const params = new URLSearchParams(window.location.search);
const vista = params.get("vista") || "cliente";

let clientesCache = [];
let lavadosCache = [];
let personalCache = [];
let usuarioLogueado = null; // dni o legajo de quien está usando esta sesión

function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
    document.getElementById(id).classList.add("activa");
}

async function apiGet(url) {
    const respuesta = await fetch(url);
    return respuesta.json();
}

async function apiPost(url, datos) {
    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });
}

// =====================
// MODAL CHICO PROPIO (reemplaza prompt() nativo)
// =====================

function mostrarAviso(mensaje) {

    document.getElementById("modal-aviso")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "modal-aviso";
    overlay.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.75);
        display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;
    `;

    overlay.innerHTML = `
        <div style="background:#1a1a1a; border:2px solid #daa520; border-radius:16px; padding:24px; width:100%; max-width:320px; text-align:center;">
            <p style="color:#f0f0f0; font-size:15px; white-space:pre-line; margin-bottom:1.2rem;">${mensaje}</p>
            <button id="btn-aviso-ok" class="btn-principal">Aceptar</button>
        </div>
    `;

    document.body.appendChild(overlay);

    const cerrar = () => overlay.remove();
    document.getElementById("btn-aviso-ok").addEventListener("click", cerrar);
    overlay.addEventListener("click", e => { if (e.target === overlay) cerrar(); });
}

function mostrarConfirmacion(mensaje) {
    return new Promise(resolve => {

        document.getElementById("modal-confirm")?.remove();

        const overlay = document.createElement("div");
        overlay.id = "modal-confirm";
        overlay.style.cssText = `
            position:fixed; inset:0; background:rgba(0,0,0,0.75);
            display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;
        `;

        overlay.innerHTML = `
            <div style="background:#1a1a1a; border:2px solid #daa520; border-radius:16px; padding:24px; width:100%; max-width:320px; text-align:center;">
                <p style="color:#f0f0f0; font-size:15px; white-space:pre-line; margin-bottom:1.2rem;">${mensaje}</p>
                <div style="display:flex; gap:10px;">
                    <button id="btn-confirm-si" class="btn-principal">Sí</button>
                    <button id="btn-confirm-no" class="btn-secundario">No</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const responder = valor => { overlay.remove(); resolve(valor); };

        document.getElementById("btn-confirm-si").addEventListener("click", () => responder(true));
        document.getElementById("btn-confirm-no").addEventListener("click", () => responder(false));
        overlay.addEventListener("click", e => { if (e.target === overlay) responder(false); });
    });
}

function pedirDato({ titulo, placeholder, maxLength }) {
    return new Promise(resolve => {

        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position:fixed; inset:0; background:rgba(0,0,0,0.75);
            display:flex; align-items:center; justify-content:center; z-index:9999;
            padding:20px;
        `;

        overlay.innerHTML = `
            <div style="background:#1a1a1a; border:2px solid #daa520; border-radius:16px; padding:24px; width:100%; max-width:320px; text-align:center;">
                <h3 style="color:#daa520; margin-top:0;">${titulo}</h3>
                <input id="input-modal-dato" type="text" maxlength="${maxLength || 20}"
                    placeholder="${placeholder || ""}"
                    style="width:100%; padding:12px; font-size:18px; border-radius:10px; border:2px solid #daa520; background:#000; color:white; text-align:center; margin-bottom:14px;">
                <button id="btn-modal-ok" class="btn-principal" style="margin-bottom:8px;">Confirmar</button>
                <button id="btn-modal-cancel" class="btn-secundario">Cancelar</button>
            </div>
        `;

        document.body.appendChild(overlay);
        const input = overlay.querySelector("#input-modal-dato");
        input.focus();

        overlay.querySelector("#btn-modal-ok").addEventListener("click", () => {
            const valor = input.value.trim();
            overlay.remove();
            resolve(valor || null);
        });

        overlay.querySelector("#btn-modal-cancel").addEventListener("click", () => {
            overlay.remove();
            resolve(null);
        });
    });
}

// =====================
// UTILIDADES DE BENEFICIO
// =====================

function tieneBeneficioLavado(cliente) {
    const categoriasAutomaticas = ["Bespoke", "Diamond", "Diamond Seg."];
    return categoriasAutomaticas.includes(cliente.categoria) || !!cliente.excepcionLavado?.activa;
}

function tieneIngresoReciente(cliente, minutos) {
    const historial = cliente.historial || [];

    const ingresos = historial
        .filter(e => e.tipo === "INGRESO")
        .map(e => Number(e.fecha))
        .sort((a, b) => b - a);

    if (ingresos.length === 0) return false;

    const minutosPasados = (Date.now() - ingresos[0]) / 60000;
    return minutosPasados <= minutos;
}

// Revisa los pedidos que ya pasaron los 30 min desde que se pidieron,
// y todavía no fueron chequeados. Corre sola cada vez que cualquiera
// de las 3 pantallas (cliente/autorizar/lavador) hace su sondeo normal.
async function verificarPedidosVencidos() {

    const MINUTOS_ESPERA = 30;
    const ahora = Date.now();

    const lavados = await apiGet("/api/lavados");
    const pendientesDeVerificar = lavados.filter(p =>
        !p.verificacionRealizada &&
        (ahora - p.fechaCreacion) >= MINUTOS_ESPERA * 60000
    );

    if (pendientesDeVerificar.length === 0) return;

    const clientesActuales = await apiGet("/api/clientes");
    let huboCambiosEnClientes = false;

    for (const pedido of pendientesDeVerificar) {

        const cliente = clientesActuales.find(c => c.id === pedido.clienteId);

        if (cliente && !tieneIngresoReciente(cliente, MINUTOS_ESPERA)) {
            if (!cliente.historial) cliente.historial = [];

            cliente.historial.push({
                tipo: "ALERTA_VERIFICACION",
                fecha: Date.now(),
                motivo: `Pidió lavado de auto sin ingreso registrado en los ${MINUTOS_ESPERA} minutos posteriores`,
                revisada: false
            });

            huboCambiosEnClientes = true;
        }

        pedido.verificacionRealizada = true;
    }

    await apiPost("/api/lavados", lavados);

    if (huboCambiosEnClientes) {
        await apiPost("/api/clientes", clientesActuales);
    }
}

// =====================================================
// VISTA CLIENTE
// =====================================================

let clienteLogueado = null;
let pedidoActualId = null;

function initVistaCliente() {
    mostrarPantalla("cliente-login");

    document.getElementById("btn-cliente-entrar").addEventListener("click", async () => {

        const dni = document.getElementById("cliente-dni").value.trim();
        const pin = document.getElementById("cliente-pin").value.trim();
        const errorEl = document.getElementById("cliente-error");
        errorEl.textContent = "";

        if (!dni || !pin) {
            errorEl.textContent = "Completá DNI y PIN";
            return;
        }

        clientesCache = await apiGet("/api/clientes");

        const cliente = clientesCache.find(c => c.dni === dni && String(c.pin) === pin);

        if (!cliente) {
            errorEl.textContent = "DNI o PIN incorrecto";
            return;
        }

        if (!tieneBeneficioLavado(cliente)) {
            errorEl.textContent = "No tenés el beneficio de lavado de auto habilitado";
            return;
        }

        clienteLogueado = cliente;
        document.getElementById("cliente-nombre-saludo").textContent = cliente.nombre;
        mostrarPantalla("cliente-form");
    });

    document.getElementById("btn-enviar-pedido").addEventListener("click", async () => {

        const modelo = document.getElementById("auto-modelo").value.trim();
        const patente = document.getElementById("auto-patente").value.trim().toUpperCase();
        const errorEl = document.getElementById("form-error");
        errorEl.textContent = "";

        if (!modelo || !patente) {
            errorEl.textContent = "Modelo y patente son obligatorios";
            return;
        }

        if (patente.length > 8) {
            errorEl.textContent = "La patente no puede tener más de 8 caracteres";
            return;
        }

        lavadosCache = await apiGet("/api/lavados");

        const pedido = {
            id: Date.now().toString(),
            clienteId: clienteLogueado.id,
            clienteNombre: clienteLogueado.nombre,
            clienteCategoria: clienteLogueado.categoria,
            modelo,
            patente,
            estado: "pendiente",
            autorizadoPorLegajo: null,
            autorizadoPorApellido: null,
            horaAutorizacion: null,
            aceptadoPorDni: null,
            horaAceptacion: null,
            numeroLlavero: null,
            horaFinalizacion: null,
            fechaCreacion: Date.now(),
            verificacionRealizada: false
        };

        lavadosCache.push(pedido);
        await apiPost("/api/lavados", lavadosCache);

        pedidoActualId = pedido.id;

        mostrarPantalla("cliente-estado");
        document.getElementById("texto-estado-cliente").textContent =
            "Tu pedido fue enviado. Esperando autorización...";

        setInterval(actualizarEstadoCliente, 8000);
        setInterval(verificarPedidosVencidos, 60000);
    });
}

async function actualizarEstadoCliente() {
    if (!pedidoActualId) return;

    lavadosCache = await apiGet("/api/lavados");
    const pedido = lavadosCache.find(p => p.id === pedidoActualId);
    if (!pedido) return;

    const textos = {
        pendiente: "Tu pedido fue enviado. Esperando autorización...",
        autorizado: "Tu pedido fue autorizado. En breve lo estarán lavando.",
        aceptado: "Tu auto está en lavado.",
        finalizado: "¡Tu auto está listo!"
    };

    document.getElementById("texto-estado-cliente").textContent =
        textos[pedido.estado] || textos.pendiente;
}

// La autorización de lavados ya no vive acá — ahora se hace desde la
// campana de alertas del sistema principal (script.js), que agrega
// "Lavado pendiente de autorizar" junto con el resto de las alertas.


// =====================================================
// VISTA LAVADOR (personal tercerizado)
// =====================================================

let lavadorLogueado = null;

function initVistaLavador() {
    mostrarPantalla("lavador-login");

    document.getElementById("btn-lavador-entrar").addEventListener("click", async () => {

        const dni = document.getElementById("lavador-dni").value.trim();
        const pin = document.getElementById("lavador-pin").value.trim();
        const errorEl = document.getElementById("lavador-error");
        errorEl.textContent = "";

        if (!dni || !pin) {
            errorEl.textContent = "Completá DNI y PIN";
            return;
        }

        personalCache = await apiGet("/api/personal?tipo=lavadero");

        const persona = personalCache.find(p => p.dni === dni && String(p.pin) === pin);

        if (!persona) {
            errorEl.textContent = "DNI o PIN incorrecto";
            return;
        }

        lavadorLogueado = persona;
        mostrarPantalla("lavador-trabajos");
        cargarTrabajosLavador();
        setInterval(cargarTrabajosLavador, 15000);
        setInterval(verificarPedidosVencidos, 60000);
    });
}

async function cargarTrabajosLavador() {

    lavadosCache = await apiGet("/api/lavados");

    const autorizados = lavadosCache
        .filter(p => p.estado === "autorizado")
        .sort((a, b) => a.horaAutorizacion - b.horaAutorizacion);

    const enCurso = lavadosCache
        .filter(p => p.estado === "aceptado" && p.aceptadoPorDni === lavadorLogueado.dni)
        .sort((a, b) => a.horaAceptacion - b.horaAceptacion);

    const contA = document.getElementById("lista-autorizados");
    const vacioA = document.getElementById("vacio-autorizados");

    if (autorizados.length === 0) {
        contA.innerHTML = "";
        vacioA.style.display = "block";
    } else {
        vacioA.style.display = "none";
        contA.innerHTML = autorizados.map(p => `
            <div class="pedido-card">
                <div class="estado">AUTORIZADO</div>
                <div class="modelo">${p.modelo}</div>
                <div class="patente">${p.patente}</div>
                <div class="autorizado">Autorizó: ${p.autorizadoPorApellido}</div>
                <button class="btn-principal" onclick="aceptarTrabajo('${p.id}')">Aceptar</button>
            </div>
        `).join("");
    }

    const contE = document.getElementById("lista-en-curso");
    const vacioE = document.getElementById("vacio-en-curso");

    if (enCurso.length === 0) {
        contE.innerHTML = "";
        vacioE.style.display = "block";
    } else {
        vacioE.style.display = "none";
        contE.innerHTML = enCurso.map(p => `
            <div class="pedido-card">
                <div class="estado">EN CURSO · llavero ${p.numeroLlavero}</div>
                <div class="modelo">${p.modelo}</div>
                <div class="patente">${p.patente}</div>
                <button class="btn-principal" onclick="finalizarTrabajo('${p.id}')">Finalizado</button>
            </div>
        `).join("");
    }
}

async function aceptarTrabajo(id) {

    const llavero = await pedirDato({
        titulo: "Número de llavero",
        placeholder: "Hasta 3 dígitos",
        maxLength: 3
    });

    if (!llavero) return;

    const pedido = lavadosCache.find(p => p.id === id);
    if (!pedido) return;

    pedido.estado = "aceptado";
    pedido.aceptadoPorDni = lavadorLogueado.dni;
    pedido.horaAceptacion = Date.now();
    pedido.numeroLlavero = llavero;

    await apiPost("/api/lavados", lavadosCache);
    cargarTrabajosLavador();
}

async function finalizarTrabajo(id) {

    const pedido = lavadosCache.find(p => p.id === id);
    if (!pedido) return;

    pedido.estado = "finalizado";
    pedido.horaFinalizacion = Date.now();

    await apiPost("/api/lavados", lavadosCache);

    // Avisa al supervisor y al operador que el auto ya está listo.
    try {
        const clientesActuales = await apiGet("/api/clientes");
        const cliente = clientesActuales.find(c => c.id === pedido.clienteId);

        if (cliente) {
            if (!cliente.historial) cliente.historial = [];

            cliente.historial.push({
                tipo: "ALERTA_LAVADO_FINALIZADO",
                fecha: Date.now(),
                motivo: `${pedido.modelo} — ${pedido.patente} · listo`,
                revisada: false
            });

            await apiPost("/api/clientes", clientesActuales);
        }
    } catch (error) {
        console.error("No se pudo avisar la finalización del lavado:", error);
    }

    cargarTrabajosLavador();
}

// =====================================================
// VISTA ADMIN (alta de personal de lavadero y de empresa)
// =====================================================

// ⚠️ Misma contraseña que ya tenés en script.js -> const supervisor = { pass: "..." }
const SUPERVISOR_PASS = "";

// =====================================================
// ARRANQUE SEGÚN LA VISTA
// =====================================================

if (vista === "lavador") {
    initVistaLavador();
} else {
    initVistaCliente();
}
