// lavadero.js
//
// Página independiente para el circuito de lavado de autos.
// No toca nada del sistema principal (script.js). Comparte la misma base
// de datos (Upstash) a través de api/clientes.js, api/lavados.js y api/personal.js.
//
// Se accede así:
//   lavadero.html                 -> vista cliente (default, la que escanea el QR)
//   lavadero.html?vista=autorizar -> vista para que operador/supervisor autorice
//   lavadero.html?vista=lavador   -> vista para el personal que lava los autos

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
    const categoriasAutomaticas = ["Bespoke", "Diamond"];
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

async function registrarAlertaVerificacion(cliente) {
    if (!cliente.historial) cliente.historial = [];

    cliente.historial.push({
        tipo: "ALERTA_VERIFICACION",
        fecha: Date.now(),
        motivo: "Uso del beneficio de lavado sin ingreso registrado en los últimos 30 minutos",
        revisada: false
    });

    await apiPost("/api/clientes", clientesCache);
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

        // Control silencioso: si no hay ingreso reciente, avisa solo al supervisor,
        // pero igual deja continuar al cliente con su pedido.
        if (!tieneIngresoReciente(cliente, 30)) {
            registrarAlertaVerificacion(cliente);
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
            fechaCreacion: Date.now()
        };

        lavadosCache.push(pedido);
        await apiPost("/api/lavados", lavadosCache);

        pedidoActualId = pedido.id;

        mostrarPantalla("cliente-estado");
        document.getElementById("texto-estado-cliente").textContent =
            "Tu pedido fue enviado. Esperando autorización...";

        setInterval(actualizarEstadoCliente, 8000);
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

// =====================================================
// VISTA AUTORIZAR (operador / supervisor)
// =====================================================

let autorizadorLogueado = null;

function initVistaAutorizar() {
    mostrarPantalla("autorizar-login");

    document.getElementById("btn-autorizar-entrar").addEventListener("click", async () => {

        const legajo = document.getElementById("autorizar-legajo").value.trim();
        const pin = document.getElementById("autorizar-pin").value.trim();
        const errorEl = document.getElementById("autorizar-error");
        errorEl.textContent = "";

        if (!legajo || !pin) {
            errorEl.textContent = "Completá legajo y PIN";
            return;
        }

        personalCache = await apiGet("/api/personal?tipo=empresa");

        const persona = personalCache.find(p => String(p.legajo) === legajo && String(p.pin) === pin);

        if (!persona) {
            errorEl.textContent = "Legajo o PIN incorrecto";
            return;
        }

        autorizadorLogueado = persona;
        mostrarPantalla("autorizar-lista");
        cargarPendientesAutorizar();
        setInterval(cargarPendientesAutorizar, 15000);
    });
}

async function cargarPendientesAutorizar() {

    lavadosCache = await apiGet("/api/lavados");

    const pendientes = lavadosCache
        .filter(p => p.estado === "pendiente")
        .sort((a, b) => a.fechaCreacion - b.fechaCreacion);

    const contenedor = document.getElementById("lista-pendientes-autorizar");
    const vacio = document.getElementById("vacio-autorizar");

    if (pendientes.length === 0) {
        contenedor.innerHTML = "";
        vacio.style.display = "block";
        return;
    }

    vacio.style.display = "none";

    contenedor.innerHTML = pendientes.map(p => {
        const minutosEsperando = Math.floor((Date.now() - p.fechaCreacion) / 60000);
        const esperandoMucho = minutosEsperando >= 2;

        return `
        <div class="pedido-card" style="${esperandoMucho ? "border-color:#ff6b6b; box-shadow:0 0 10px rgba(255,107,107,0.5);" : ""}">
            <div class="estado">PENDIENTE ${esperandoMucho ? `· esperando ${minutosEsperando} min` : ""}</div>
            <div class="modelo">${p.clienteNombre}</div>
            <div class="patente">${p.modelo} — ${p.patente}</div>
            <button class="btn-principal" onclick="autorizarPedido('${p.id}')">Autorizar</button>
        </div>
        `;
    }).join("");
}

async function autorizarPedido(id) {

    const pedido = lavadosCache.find(p => p.id === id);
    if (!pedido) return;

    pedido.estado = "autorizado";
    pedido.autorizadoPorLegajo = autorizadorLogueado.legajo;
    pedido.autorizadoPorApellido = autorizadorLogueado.apellido;
    pedido.horaAutorizacion = Date.now();

    await apiPost("/api/lavados", lavadosCache);
    cargarPendientesAutorizar();
}

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
    cargarTrabajosLavador();
}

// =====================================================
// VISTA ADMIN (alta de personal de lavadero y de empresa)
// =====================================================

// ⚠️ Misma contraseña que ya tenés en script.js -> const supervisor = { pass: "..." }
const SUPERVISOR_PASS = "Operaciones2026";

function initVistaAdmin() {
    mostrarPantalla("admin-login");

    document.getElementById("btn-admin-entrar").addEventListener("click", async () => {
        const pass = document.getElementById("admin-pass").value;

        if (pass !== SUPERVISOR_PASS) {
            document.getElementById("admin-error").textContent = "Contraseña incorrecta";
            return;
        }

        mostrarPantalla("admin-gestion");
        await Promise.all([cargarListaLavadero(), cargarListaEmpresa()]);
    });

    document.getElementById("btn-agregar-lavador").addEventListener("click", agregarLavador);
    document.getElementById("btn-agregar-empresa").addEventListener("click", agregarEmpresa);
}

function generarPinLocal(cantidadDigitos) {
    const min = Math.pow(10, cantidadDigitos - 1);
    const max = Math.pow(10, cantidadDigitos) - 1;
    return String(Math.floor(min + Math.random() * (max - min + 1)));
}

async function cargarListaLavadero() {
    const lista = await apiGet("/api/personal?tipo=lavadero");
    const contenedor = document.getElementById("lista-personal-lavadero");

    contenedor.innerHTML = lista.length === 0
        ? `<p style="color:#888;">Sin personal cargado todavía</p>`
        : lista.map(p => `
            <div class="persona-card">
                <div class="datos">
                    <strong>${p.nombre}</strong><br>
                    DNI: ${p.dni} · PIN: <span class="pin">${p.pin}</span>
                </div>
                <button onclick="eliminarLavador('${p.dni}')">Borrar</button>
            </div>
        `).join("");
}

async function cargarListaEmpresa() {
    const lista = await apiGet("/api/personal?tipo=empresa");
    const contenedor = document.getElementById("lista-personal-empresa");

    contenedor.innerHTML = lista.length === 0
        ? `<p style="color:#888;">Sin personal cargado todavía</p>`
        : lista.map(p => `
            <div class="persona-card">
                <div class="datos">
                    <strong>${p.nombre} ${p.apellido}</strong><br>
                    Legajo: ${p.legajo} · PIN: <span class="pin">${p.pin}</span>
                </div>
                <button onclick="eliminarEmpresa('${p.legajo}')">Borrar</button>
            </div>
        `).join("");
}

async function agregarLavador() {
    const dni = document.getElementById("nuevo-lavador-dni").value.trim();
    const nombre = document.getElementById("nuevo-lavador-nombre").value.trim();

    if (!dni || !nombre) {
        alert("Completá DNI y nombre");
        return;
    }

    const lista = await apiGet("/api/personal?tipo=lavadero");

    if (lista.some(p => p.dni === dni)) {
        alert("Ya existe una persona con ese DNI");
        return;
    }

    lista.push({ dni, nombre, pin: generarPinLocal(4) });
    await apiPost("/api/personal?tipo=lavadero", lista);

    document.getElementById("nuevo-lavador-dni").value = "";
    document.getElementById("nuevo-lavador-nombre").value = "";

    cargarListaLavadero();
}

async function agregarEmpresa() {
    const legajo = document.getElementById("nuevo-empresa-legajo").value.trim();
    const nombre = document.getElementById("nuevo-empresa-nombre").value.trim();
    const apellido = document.getElementById("nuevo-empresa-apellido").value.trim();

    if (!legajo || !nombre || !apellido) {
        alert("Completá legajo, nombre y apellido");
        return;
    }

    const lista = await apiGet("/api/personal?tipo=empresa");

    if (lista.some(p => p.legajo === legajo)) {
        alert("Ya existe una persona con ese legajo");
        return;
    }

    lista.push({ legajo, nombre, apellido, pin: generarPinLocal(4) });
    await apiPost("/api/personal?tipo=empresa", lista);

    document.getElementById("nuevo-empresa-legajo").value = "";
    document.getElementById("nuevo-empresa-nombre").value = "";
    document.getElementById("nuevo-empresa-apellido").value = "";

    cargarListaEmpresa();
}

async function eliminarLavador(dni) {
    if (!confirm("¿Borrar esta persona?")) return;

    let lista = await apiGet("/api/personal?tipo=lavadero");
    lista = lista.filter(p => p.dni !== dni);
    await apiPost("/api/personal?tipo=lavadero", lista);
    cargarListaLavadero();
}

async function eliminarEmpresa(legajo) {
    if (!confirm("¿Borrar esta persona?")) return;

    let lista = await apiGet("/api/personal?tipo=empresa");
    lista = lista.filter(p => p.legajo !== legajo);
    await apiPost("/api/personal?tipo=empresa", lista);
    cargarListaEmpresa();
}

// =====================================================
// ARRANQUE SEGÚN LA VISTA
// =====================================================

if (vista === "autorizar") {
    initVistaAutorizar();
} else if (vista === "lavador") {
    initVistaLavador();
} else if (vista === "admin") {
    initVistaAdmin();
} else {
    initVistaCliente();
}
