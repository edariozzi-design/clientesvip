// gastronomia.js
//
// Página independiente para el circuito de gastronomía.
// No toca nada del sistema principal (script.js) ni del lavadero.
// Comparte la misma base de datos (Upstash) a través de las funciones api/.
//
// Se accede así:
//   gastronomia.html                 -> vista cliente (default, la que escanea el QR)
//   gastronomia.html?vista=cierre    -> cierre de turno del camarero
//   gastronomia.html?vista=admin     -> alta de menú, puntos de pedido y generador de QR
//
// La confirmación de pedidos por parte del camarero se hace desde la
// campana de alertas del sistema principal (script.js), igual que con lavado.

// ⚠️ Misma contraseña que ya tenés en script.js -> const supervisor = { pass: "..." }
const SUPERVISOR_PASS = "";

const params = new URLSearchParams(window.location.search);
const vista = params.get("vista") || "cliente";

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

function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.classList.remove("activa"));
    document.getElementById(id).classList.add("activa");
}

// =====================
// MODAL CHICO PROPIO
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
    document.getElementById("btn-aviso-ok").addEventListener("click", () => overlay.remove());
}

// =====================================================
// UTILIDADES
// =====================================================

function getFechaOperativa(fecha) {
    const f = new Date(fecha);
    if (f.getHours() < 6) f.setDate(f.getDate() - 1);
    f.setHours(0, 0, 0, 0);
    return f;
}

function dentroDeAlgunaFranja(horarios) {
    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

    return (horarios || []).some(h => {
        const [hd, md] = h.desde.split(":").map(Number);
        const [hh, mh] = h.hasta.split(":").map(Number);
        const minutosDesde = hd * 60 + md;
        const minutosHasta = hh * 60 + mh;

        if (minutosDesde <= minutosHasta) {
            return minutosAhora >= minutosDesde && minutosAhora <= minutosHasta;
        }
        // Franja que cruza medianoche (ej: 21:00 a 01:00)
        return minutosAhora >= minutosDesde || minutosAhora <= minutosHasta;
    });
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
// de las pantallas (cliente/cierre) hace su sondeo normal.
async function verificarPedidosVencidos() {

    const MINUTOS_ESPERA = 30;
    const ahora = Date.now();

    const pedidos = await apiGet("/api/pedidos");
    const pendientesDeVerificar = pedidos.filter(p =>
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
                motivo: `Pidió gastronomía (punto ${pedido.punto}) sin ingreso registrado en los ${MINUTOS_ESPERA} minutos posteriores`,
                revisada: false
            });

            huboCambiosEnClientes = true;
        }

        pedido.verificacionRealizada = true;
    }

    await apiPost("/api/pedidos", pedidos);

    if (huboCambiosEnClientes) {
        await apiPost("/api/clientes", clientesActuales);
    }
}

// Avisa al celular del jefe si un pedido lleva 10+ minutos sin que
// ningún camarero lo confirme (distinto del resaltado visual de 5 min,
// que es solo local en la pantalla de pedidos).
async function verificarPedidosDemorados() {

    const MINUTOS_DEMORA = 10;
    const ahora = Date.now();

    const pedidos = await apiGet("/api/pedidos");
    const demorados = pedidos.filter(p =>
        p.estado === "pendiente" &&
        !p.alertaDemoraEnviada &&
        (ahora - p.fechaCreacion) >= MINUTOS_DEMORA * 60000
    );

    if (demorados.length === 0) return;

    const clientesActuales = await apiGet("/api/clientes");
    let huboCambios = false;

    for (const pedido of demorados) {

        const cliente = clientesActuales.find(c => c.id === pedido.clienteId);

        if (cliente) {
            if (!cliente.historial) cliente.historial = [];

            cliente.historial.push({
                tipo: "ALERTA_PEDIDO_DEMORADO",
                fecha: Date.now(),
                motivo: `Pedido sin confirmar hace más de ${MINUTOS_DEMORA} min (punto ${pedido.punto})`,
                revisada: false
            });

            huboCambios = true;
        }

        pedido.alertaDemoraEnviada = true;
    }

    await apiPost("/api/pedidos", pedidos);

    if (huboCambios) {
        await apiPost("/api/clientes", clientesActuales);
    }
}

// =====================================================
// VISTA PEDIDOS (pantalla fija de PC/Tablet, sin login)
// =====================================================

function initVistaCamarero() {
    mostrarPantalla("camarero-pantalla");

    // Pestañas internas: Pedidos entrantes / Cierre de turno
    document.querySelectorAll("[data-tab-camarero]").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("[data-tab-camarero]").forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
            document.getElementById("tab-pedidos-camarero").style.display =
                btn.dataset.tabCamarero === "tab-pedidos-camarero" ? "block" : "none";
            document.getElementById("tab-cierre-camarero").style.display =
                btn.dataset.tabCamarero === "tab-cierre-camarero" ? "block" : "none";
        });
    });

    cargarPedidosPantalla();
    setInterval(cargarPedidosPantalla, 10000);
    setInterval(verificarPedidosDemorados, 60000);

    initCierreDeTurno();
}

async function cargarPedidosPantalla() {

    const pedidos = await apiGet("/api/pedidos");
    const pendientes = pedidos
        .filter(p => p.estado === "pendiente")
        .sort((a, b) => a.fechaCreacion - b.fechaCreacion);

    const grid = document.getElementById("pedidos-grid");
    const vacio = document.getElementById("pedidos-vacio");

    if (pendientes.length === 0) {
        grid.innerHTML = "";
        vacio.style.display = "block";
        return;
    }

    vacio.style.display = "none";

    const ahora = Date.now();

    grid.innerHTML = pendientes.map(p => {

        const minutosEsperando = Math.floor((ahora - p.fechaCreacion) / 60000);
        const demorado = minutosEsperando >= 5;
        const detalle = p.items.map(i => `${i.cantidad}x ${i.nombre}`).join(", ");

        return `
            <div class="pedido-card ${demorado ? "demorado" : ""}">
                <div style="font-weight:700; color:white; font-size:16px;">${p.clienteNombre}</div>
                <div style="color:#d4af37; font-size:13px;">Punto: ${p.punto}</div>
                <div style="color:#d4af37; font-size:14px; margin-top:6px;">${detalle}</div>
                ${p.aclaraciones ? `<div style="color:#999; font-size:12px; font-style:italic; margin-top:4px;">"${p.aclaraciones}"</div>` : ""}
                ${demorado ? `<div class="aviso-demora">⚠ Pedido pendiente de confirmar (${minutosEsperando} min)</div>` : ""}
                <button class="btn-principal" style="margin-top:12px;" onclick="abrirConfirmarPedidoPantalla('${p.id}')">Confirmar</button>
            </div>
        `;
    }).join("");
}

function abrirConfirmarPedidoPantalla(pedidoId) {

    document.getElementById("modal-confirmar-pedido-pantalla")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "modal-confirmar-pedido-pantalla";
    overlay.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.75);
        display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;
    `;

    overlay.innerHTML = `
        <div class="card-login" style="width:100%; max-width:320px; margin:0;">
            <h1 style="color:var(--dorado); font-size:20px; margin-bottom:14px;">Confirmar pedido</h1>
            <input type="text" id="confirmar-pantalla-legajo" placeholder="Legajo">
            <input type="password" id="confirmar-pantalla-pin" placeholder="PIN" maxlength="4" autocomplete="off">
            <div class="msg-error" id="confirmar-pantalla-error"></div>
            <button class="btn-principal" id="btn-confirmar-pantalla-ok">Confirmar</button>
            <button class="btn-secundario" id="btn-confirmar-pantalla-cancelar">Cancelar</button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("btn-confirmar-pantalla-cancelar").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });

    document.getElementById("btn-confirmar-pantalla-ok").addEventListener("click", async () => {

        const legajo = document.getElementById("confirmar-pantalla-legajo").value.trim();
        const pin = document.getElementById("confirmar-pantalla-pin").value.trim();
        const errorEl = document.getElementById("confirmar-pantalla-error");

        if (!legajo || !pin) {
            errorEl.textContent = "Completá legajo y PIN";
            return;
        }

        try {
            const personal = await apiGet("/api/personal?tipo=camareros");
            const persona = personal.find(p => String(p.legajo) === legajo && String(p.pin) === pin);

            if (!persona) {
                errorEl.textContent = "Legajo o PIN incorrecto";
                return;
            }

            const pedidos = await apiGet("/api/pedidos");
            const pedido = pedidos.find(p => p.id === pedidoId);

            if (!pedido) {
                errorEl.textContent = "El pedido ya no existe (¿otro camarero lo confirmó?)";
                return;
            }

            pedido.estado = "confirmado";
            pedido.confirmadoPorLegajo = persona.legajo;
            pedido.confirmadoPorApellido = persona.apellido;
            pedido.horaConfirmacion = Date.now();

            await apiPost("/api/pedidos", pedidos);

            overlay.remove();
            cargarPedidosPantalla();

        } catch (error) {
            errorEl.textContent = "No se pudo confirmar, probá de nuevo";
            console.error(error);
        }
    });
}

function tieneBeneficioGastronomia(cliente) {
    const categoriasAutomaticas = ["Bespoke", "Diamond", "Diamond Seg.", "Platinum"];
    return categoriasAutomaticas.includes(cliente.categoria) || !!cliente.excepcionGastronomia?.activa;
}

// =====================================================
// VISTA CLIENTE
// =====================================================

let clienteLogueado = null;
let menuActivo = [];
let tipoMenuActivo = "beneficio"; // "beneficio" | "pago"
let carrito = {}; // { nombreItem: {cantidad} }
let pedidoActualId = null;
let categoriasActivas = [];

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

        const clientes = await apiGet("/api/clientes");
        const cliente = clientes.find(c => c.dni === dni && String(c.pin) === pin);

        if (!cliente) {
            errorEl.textContent = "DNI o PIN incorrecto";
            return;
        }

        const tieneExcepcion = cliente.excepcionGastronomia?.activa && !cliente.excepcionGastronomia?.usado;

        if (!tieneBeneficioGastronomia(cliente) && !tieneExcepcion) {
            errorEl.textContent = "No tenés el beneficio de gastronomía habilitado";
            return;
        }

        clienteLogueado = cliente;
        tipoMenuActivo = "beneficio";

        const [categorias, horarios, items] = await Promise.all([
            apiGet("/api/menu?tipo=categorias"),
            apiGet("/api/menu?tipo=horarios"),
            apiGet("/api/menu?tipo=items")
        ]);

        const dentroDeHorario = dentroDeAlgunaFranja(horarios);

        categoriasActivas = categorias.filter(c => c.siempreDisponible || dentroDeHorario);
        menuActivo = items.filter(i => categoriasActivas.some(c => c.nombre === i.categoria));

        document.getElementById("titulo-menu-cliente").textContent = "Carta";
        document.getElementById("submenu-cliente").textContent = tieneExcepcion
            ? `Excepción autorizada — hasta ${cliente.excepcionGastronomia.maxItems || 3} ítems`
            : (dentroDeHorario ? "" : "Fuera de horario de comida — solo cortesías");

        carrito = {};
        renderMenuCliente();
        mostrarPantalla("cliente-menu");
    });

    document.getElementById("btn-enviar-pedido").addEventListener("click", enviarPedido);
}

function renderMenuCliente() {

    const contenedor = document.getElementById("lista-menu-cliente");

    if (menuActivo.length === 0) {
        contenedor.innerHTML = `<div class="vacio">No hay ítems disponibles en este momento</div>`;
        actualizarResumen();
        return;
    }

    contenedor.innerHTML = categoriasActivas.map(cat => {

        const items = menuActivo.filter(i => i.categoria === cat.nombre);
        if (items.length === 0) return "";

        return `
            <div class="banner-categoria">${cat.nombre}${cat.siempreDisponible ? " (24 hs)" : ""}</div>
            ${items.map(item => `
                <div class="menu-item">
                    <div class="info">
                        <div class="nombre">${item.nombre}</div>
                    </div>
                    <div class="cantidad-control">
                        <button onclick="cambiarCantidad('${item.nombre}', -1)">−</button>
                        <span class="cantidad-valor" id="cant-${item.nombre.replace(/\s+/g, "_")}">0</span>
                        <button onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
                    </div>
                </div>
            `).join("")}
        `;
    }).join("");

    actualizarResumen();
}

function cambiarCantidad(nombre, delta) {

    const maxItems = clienteLogueado?.excepcionGastronomia?.activa && !clienteLogueado?.excepcionGastronomia?.usado
        ? (clienteLogueado.excepcionGastronomia.maxItems || 3)
        : null;

    const totalActual = Object.values(carrito).reduce((s, i) => s + i.cantidad, 0);

    if (delta > 0 && maxItems && totalActual >= maxItems) {
        mostrarAviso(`Tu excepción permite un máximo de ${maxItems} ítems.`);
        return;
    }

    const item = menuActivo.find(i => i.nombre === nombre);
    if (!item) return;

    if (!carrito[nombre]) carrito[nombre] = { cantidad: 0 };

    carrito[nombre].cantidad = Math.max(0, carrito[nombre].cantidad + delta);

    if (carrito[nombre].cantidad === 0) delete carrito[nombre];

    const span = document.getElementById(`cant-${nombre.replace(/\s+/g, "_")}`);
    if (span) span.textContent = carrito[nombre]?.cantidad || 0;

    actualizarResumen();
}

function actualizarResumen() {
    const cantidadTotal = Object.values(carrito).reduce((s, i) => s + i.cantidad, 0);

    document.getElementById("resumen-cantidad").textContent = `${cantidadTotal} ítem${cantidadTotal === 1 ? "" : "s"}`;
    document.getElementById("resumen-total").textContent = "";
}

async function enviarPedido() {

    const errorEl = document.getElementById("pedido-error");
    errorEl.textContent = "";

    const punto = document.getElementById("cliente-punto").value.trim();
    const aclaraciones = document.getElementById("cliente-aclaraciones").value.trim();

    const items = Object.entries(carrito).map(([nombre, datos]) => ({
        nombre, cantidad: datos.cantidad
    }));

    if (items.length === 0) {
        errorEl.textContent = "Elegí al menos un ítem";
        return;
    }

    if (!punto) {
        errorEl.textContent = "Indicá el número de máquina, mesa o barra";
        return;
    }

    const pedidos = await apiGet("/api/pedidos");

    const usandoExcepcion = clienteLogueado.excepcionGastronomia?.activa && !clienteLogueado.excepcionGastronomia?.usado;

    const pedido = {
        id: Date.now().toString(),
        clienteId: clienteLogueado.id,
        clienteNombre: clienteLogueado.nombre,
        clienteCategoria: clienteLogueado.categoria,
        punto,
        items,
        aclaraciones,
        tipoMenu: tipoMenuActivo,
        estado: "pendiente",
        confirmadoPorLegajo: null,
        confirmadoPorApellido: null,
        horaConfirmacion: null,
        horaEntrega: null,
        autorizadoPorJefe: usandoExcepcion
            ? `${clienteLogueado.excepcionGastronomia.autorizadoPorApellido || ""}`.trim() || null
            : null,
        fechaCreacion: Date.now()
    };

    pedidos.push(pedido);
    await apiPost("/api/pedidos", pedidos);

    // Si usó una excepción, la marcamos como usada (era para 1 pedido)
    if (clienteLogueado.excepcionGastronomia?.activa && !clienteLogueado.excepcionGastronomia?.usado) {
        const clientes = await apiGet("/api/clientes");
        const c = clientes.find(x => x.id === clienteLogueado.id);
        if (c) {
            c.excepcionGastronomia.usado = true;
            await apiPost("/api/clientes", clientes);
        }
    }

    pedidoActualId = pedido.id;
    mostrarPantalla("cliente-estado");
    document.getElementById("texto-estado-cliente").textContent = "Tu pedido fue enviado. En breve te lo confirman...";

    setInterval(actualizarEstadoCliente, 8000);
    setInterval(verificarPedidosVencidos, 60000);
    setInterval(verificarPedidosDemorados, 60000);
}

async function actualizarEstadoCliente() {
    if (!pedidoActualId) return;

    const pedidos = await apiGet("/api/pedidos");
    const pedido = pedidos.find(p => p.id === pedidoActualId);
    if (!pedido) return;

    const textos = {
        pendiente: "Tu pedido fue enviado. En breve te lo confirman...",
        confirmado: "Tu pedido está en preparación.",
        entregado: "¡Tu pedido fue entregado!"
    };

    document.getElementById("texto-estado-cliente").textContent = textos[pedido.estado] || textos.pendiente;
}

// =====================================================
// VISTA CIERRE DE TURNO (camarero)
// =====================================================

let camareroLogueado = null;
let pedidosCierre = [];

function initCierreDeTurno() {

    document.getElementById("btn-cierre-entrar").addEventListener("click", async () => {

        const legajo = document.getElementById("cierre-legajo").value.trim();
        const pin = document.getElementById("cierre-pin").value.trim();
        const errorEl = document.getElementById("cierre-error");
        errorEl.textContent = "";

        if (!legajo || !pin) {
            errorEl.textContent = "Completá legajo y PIN";
            return;
        }

        const personal = await apiGet("/api/personal?tipo=camareros");
        const persona = personal.find(p => String(p.legajo) === legajo && String(p.pin) === pin);

        if (!persona) {
            errorEl.textContent = "Legajo o PIN incorrecto";
            return;
        }

        camareroLogueado = persona;

        const pedidos = await apiGet("/api/pedidos");
        const jornadaActual = getFechaOperativa(new Date()).getTime();

        pedidosCierre = pedidos.filter(p =>
            p.confirmadoPorLegajo === persona.legajo &&
            p.horaConfirmacion &&
            getFechaOperativa(p.horaConfirmacion).getTime() === jornadaActual
        );

        document.getElementById("titulo-cierre").textContent = `Rendición de ${persona.nombre} ${persona.apellido}`;
        renderCierre();

        document.getElementById("cierre-login-sub").style.display = "none";
        document.getElementById("cierre-resultado-sub").style.display = "block";
    });

    document.getElementById("btn-imprimir-cierre").addEventListener("click", () => window.print());
    document.getElementById("btn-volver-cierre").addEventListener("click", () => {
        document.getElementById("cierre-resultado-sub").style.display = "none";
        document.getElementById("cierre-login-sub").style.display = "block";
        document.getElementById("cierre-legajo").value = "";
        document.getElementById("cierre-pin").value = "";
    });
}

function renderCierre() {
    const contenedor = document.getElementById("lista-cierre");
    const vacio = document.getElementById("vacio-cierre");

    if (pedidosCierre.length === 0) {
        contenedor.innerHTML = "";
        vacio.style.display = "block";
        return;
    }

    vacio.style.display = "none";

    contenedor.innerHTML = pedidosCierre.map(p => `
        <div class="pedido-card">
            <div style="font-weight:700; color:white;">${p.clienteNombre} — Punto ${p.punto}</div>
            <div style="color:#d4af37; font-size:13px;">
                ${p.items.map(i => `${i.cantidad}x ${i.nombre}`).join(", ")}
            </div>
            ${p.aclaraciones ? `<div style="color:#999; font-size:12px; font-style:italic;">"${p.aclaraciones}"</div>` : ""}
            <div style="color:#999; font-size:12px; margin-top:4px;">
                ${new Date(p.horaConfirmacion).toLocaleTimeString("es-AR")}
            </div>
        </div>
    `).join("");
}

// =====================================================
// VISTA ADMIN
// =====================================================

function initVistaAdmin() {
    mostrarPantalla("admin-login");

    document.getElementById("btn-admin-entrar").addEventListener("click", async () => {
        const pass = document.getElementById("admin-pass").value;

        if (pass !== SUPERVISOR_PASS) {
            document.getElementById("admin-error").textContent = "Contraseña incorrecta";
            return;
        }

        mostrarPantalla("admin-gestion");
        await cargarTodoAdmin();
    });

    document.getElementById("btn-volver-admin-login").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    document.getElementById("btn-volver-admin").addEventListener("click", () => {
        document.getElementById("admin-pass").value = "";
        document.getElementById("admin-error").textContent = "";
        mostrarPantalla("admin-login");
    });

    document.querySelectorAll(".tabs button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
            ["tab-menu", "tab-puntos"].forEach(id => {
                document.getElementById(id).style.display = id === btn.dataset.tab ? "block" : "none";
            });
        });
    });

    document.getElementById("btn-agregar-horario").addEventListener("click", async () => {
        const nombre = document.getElementById("nuevo-horario-nombre").value.trim();
        const desde = document.getElementById("nuevo-horario-desde").value;
        const hasta = document.getElementById("nuevo-horario-hasta").value;

        if (!nombre || !desde || !hasta) {
            mostrarAviso("Completá nombre, desde y hasta");
            return;
        }

        const lista = await apiGet("/api/menu?tipo=horarios");
        lista.push({ nombre, desde, hasta });
        await apiPost("/api/menu?tipo=horarios", lista);

        document.getElementById("nuevo-horario-nombre").value = "";
        document.getElementById("nuevo-horario-desde").value = "";
        document.getElementById("nuevo-horario-hasta").value = "";
        cargarHorarios();
    });

    document.getElementById("btn-agregar-categoria").addEventListener("click", async () => {
        const nombre = document.getElementById("nueva-categoria-nombre").value.trim();
        const siempreDisponible = document.getElementById("nueva-categoria-siempre").checked;

        if (!nombre) {
            mostrarAviso("Poné un nombre para la categoría");
            return;
        }

        const lista = await apiGet("/api/menu?tipo=categorias");

        if (lista.some(c => c.nombre === nombre)) {
            mostrarAviso("Ya existe una categoría con ese nombre");
            return;
        }

        lista.push({ nombre, siempreDisponible });
        await apiPost("/api/menu?tipo=categorias", lista);

        document.getElementById("nueva-categoria-nombre").value = "";
        document.getElementById("nueva-categoria-siempre").checked = false;
        cargarCategorias();
    });

    document.getElementById("btn-agregar-item").addEventListener("click", async () => {
        const nombre = document.getElementById("nuevo-item-nombre").value.trim();
        const categoria = document.getElementById("nuevo-item-categoria").value;

        if (!nombre || !categoria) {
            mostrarAviso("Completá el nombre y elegí una categoría");
            return;
        }

        const lista = await apiGet("/api/menu?tipo=items");
        lista.push({ nombre, categoria });
        await apiPost("/api/menu?tipo=items", lista);

        document.getElementById("nuevo-item-nombre").value = "";
        cargarItemsMenu();
    });

    document.getElementById("btn-agregar-isla").addEventListener("click", async () => {
        const codigo = document.getElementById("nueva-isla-codigo").value.trim();
        if (!codigo || codigo.length !== 4) {
            mostrarAviso("El código de isla tiene que tener 4 dígitos");
            return;
        }
        const puntos = await apiGet("/api/puntos");
        if (puntos.some(p => p.codigo === codigo)) {
            mostrarAviso("Ya existe una isla con ese código");
            return;
        }
        puntos.push({ codigo, tipo: "isla", nombre: `Isla ${codigo}` });
        await apiPost("/api/puntos", puntos);
        document.getElementById("nueva-isla-codigo").value = "";
        cargarPuntos();
    });

    document.getElementById("btn-crear-barras").addEventListener("click", async () => {
        const puntos = await apiGet("/api/puntos");
        ["Barra 1", "Barra 2"].forEach(nombre => {
            if (!puntos.some(p => p.nombre === nombre)) {
                puntos.push({ codigo: nombre, tipo: "barra", nombre });
            }
        });
        await apiPost("/api/puntos", puntos);
        cargarPuntos();
    });

    document.getElementById("btn-crear-mesas").addEventListener("click", async () => {
        const cantidad = Number(document.getElementById("cantidad-mesas").value) || 0;
        if (cantidad <= 0) return;

        const puntos = await apiGet("/api/puntos");
        const mesasExistentes = puntos.filter(p => p.tipo === "mesa").length;

        for (let i = 1; i <= cantidad; i++) {
            const numero = mesasExistentes + i;
            puntos.push({ codigo: `Mesa ${numero}`, tipo: "mesa", nombre: `Mesa ${numero}` });
        }

        await apiPost("/api/puntos", puntos);
        document.getElementById("cantidad-mesas").value = "";
        cargarPuntos();
    });
}

async function cargarTodoAdmin() {
    await cargarHorarios();
    await cargarCategorias();
    await cargarItemsMenu();
    await cargarPuntos();
}

function generarPinLocal(cantidadDigitos) {
    const min = Math.pow(10, cantidadDigitos - 1);
    const max = Math.pow(10, cantidadDigitos) - 1;
    return String(Math.floor(min + Math.random() * (max - min + 1)));
}

async function cargarHorarios() {
    const lista = await apiGet("/api/menu?tipo=horarios");
    document.getElementById("lista-horarios").innerHTML = lista.length === 0
        ? `<p style="color:#888;">Sin franjas cargadas</p>`
        : lista.map((h, i) => `
            <div class="menu-item">
                <div class="info">
                    <div class="nombre">${h.nombre}</div>
                    <div class="precio">${h.desde} a ${h.hasta}</div>
                </div>
                <button class="btn-secundario" style="width:auto; padding:6px 12px;" onclick="borrarHorario(${i})">Borrar</button>
            </div>
        `).join("");
}

async function borrarHorario(indice) {
    const lista = await apiGet("/api/menu?tipo=horarios");
    lista.splice(indice, 1);
    await apiPost("/api/menu?tipo=horarios", lista);
    cargarHorarios();
}

async function cargarCategorias() {
    const lista = await apiGet("/api/menu?tipo=categorias");

    document.getElementById("lista-categorias").innerHTML = lista.length === 0
        ? `<p style="color:#888;">Sin categorías cargadas</p>`
        : lista.map((c, i) => `
            <div class="menu-item">
                <div class="info">
                    <div class="nombre">${c.nombre}</div>
                    <div class="precio">${c.siempreDisponible ? "Siempre disponible" : "Depende del horario"}</div>
                </div>
                <button class="btn-secundario" style="width:auto; padding:6px 12px;" onclick="borrarCategoria(${i})">Borrar</button>
            </div>
        `).join("");

    // Actualiza también el <select> del formulario de ítems.
    const select = document.getElementById("nuevo-item-categoria");
    select.innerHTML = lista.length === 0
        ? `<option value="">Primero cargá una categoría</option>`
        : lista.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join("");
}

async function borrarCategoria(indice) {
    const lista = await apiGet("/api/menu?tipo=categorias");
    lista.splice(indice, 1);
    await apiPost("/api/menu?tipo=categorias", lista);
    cargarCategorias();
}

async function cargarItemsMenu() {
    const lista = await apiGet("/api/menu?tipo=items");
    document.getElementById("lista-items-menu").innerHTML = lista.length === 0
        ? `<p style="color:#888;">Sin ítems cargados</p>`
        : lista.map((item, i) => `
            <div class="menu-item">
                <div class="info">
                    <div class="nombre">${item.nombre}</div>
                    <div class="precio">${item.categoria}</div>
                </div>
                <button class="btn-secundario" style="width:auto; padding:6px 12px;" onclick="borrarItemMenu(${i})">Borrar</button>
            </div>
        `).join("");
}

async function borrarItemMenu(indice) {
    const lista = await apiGet("/api/menu?tipo=items");
    lista.splice(indice, 1);
    await apiPost("/api/menu?tipo=items", lista);
    cargarItemsMenu();
}

async function cargarPuntos() {
    const puntos = await apiGet("/api/puntos");

    const render = (tipo, contenedorId) => {
        const filtrados = puntos.filter(p => p.tipo === tipo);
        document.getElementById(contenedorId).innerHTML = filtrados.length === 0
            ? `<p style="color:#888;">Sin cargar</p>`
            : filtrados.map(p => `
                <div class="menu-item">
                    <div class="info"><div class="nombre">${p.nombre}</div></div>
                    <button class="btn-secundario" style="width:auto; padding:6px 12px;" onclick="borrarPunto('${p.codigo}')">Borrar</button>
                </div>
            `).join("");
    };

    render("isla", "lista-islas");
    render("barra", "lista-barras");
    render("mesa", "lista-mesas");
}

async function borrarPunto(codigo) {
    let puntos = await apiGet("/api/puntos");
    puntos = puntos.filter(p => p.codigo !== codigo);
    await apiPost("/api/puntos", puntos);
    cargarPuntos();
}

// La generación de QR se hace con una herramienta externa, apuntando cada
// código a: gastronomia.html?punto=CODIGO (donde CODIGO es el código de la
// isla, barra o mesa, tal como se cargó en la pestaña "Puntos de pedido").

// =====================================================
// ARRANQUE SEGÚN LA VISTA
// =====================================================

// Si el QR trae un punto pre-cargado, lo completamos solo al llegar al menú
const puntoDesdeQR = params.get("punto");

if (vista === "camarero") {
    initVistaCamarero();
} else if (vista === "admin") {
    initVistaAdmin();
} else {
    initVistaCliente();
}

document.addEventListener("DOMContentLoaded", () => {
    if (puntoDesdeQR) {
        const intervalo = setInterval(() => {
            const input = document.getElementById("cliente-punto");
            if (input) {
                input.value = puntoDesdeQR;
                clearInterval(intervalo);
            }
        }, 300);
    }
});
