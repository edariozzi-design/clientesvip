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

function estaEnHorarioBeneficio(horario) {
    const ahora = new Date();
    const [hd, md] = horario.desde.split(":").map(Number);
    const [hh, mh] = horario.hasta.split(":").map(Number);
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const minutosDesde = hd * 60 + md;
    const minutosHasta = hh * 60 + mh;

    if (minutosDesde <= minutosHasta) {
        return minutosAhora >= minutosDesde && minutosAhora <= minutosHasta;
    }
    // Horario que cruza medianoche (ej: 20:00 a 02:00)
    return minutosAhora >= minutosDesde || minutosAhora <= minutosHasta;
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
let carrito = {}; // { nombreItem: {cantidad, precio} }
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

        const clientes = await apiGet("/api/clientes");
        const cliente = clientes.find(c => c.dni === dni && String(c.pin) === pin);

        if (!cliente) {
            errorEl.textContent = "DNI o PIN incorrecto";
            return;
        }

        const tieneBeneficio = tieneBeneficioGastronomia(cliente);
        const horario = await apiGet("/api/menu?tipo=horario");
        const dentroDeHorario = estaEnHorarioBeneficio(horario);

        clienteLogueado = cliente;

        if (tieneBeneficio && dentroDeHorario) {
            tipoMenuActivo = "beneficio";
            menuActivo = await apiGet("/api/menu?tipo=beneficio");
            document.getElementById("titulo-menu-cliente").textContent = "Menú";
            document.getElementById("submenu-cliente").textContent = "Beneficio incluido";
        } else {
            tipoMenuActivo = "pago";
            menuActivo = await apiGet("/api/menu?tipo=pago");
            document.getElementById("titulo-menu-cliente").textContent = "Menú";
            document.getElementById("submenu-cliente").textContent = tieneBeneficio
                ? "Fuera del horario de beneficio — este menú tiene precio"
                : "";
        }

        // Si tiene una excepción activa (máximo 3 ítems, sin importar horario)
        if (cliente.excepcionGastronomia?.activa && !cliente.excepcionGastronomia?.usado) {
            tipoMenuActivo = "beneficio";
            menuActivo = await apiGet("/api/menu?tipo=beneficio");
            document.getElementById("submenu-cliente").textContent =
                `Excepción autorizada — hasta ${cliente.excepcionGastronomia.maxItems || 3} ítems`;
        }

        carrito = {};
        renderMenuCliente();
        mostrarPantalla("cliente-menu");
    });

    document.getElementById("btn-enviar-pedido").addEventListener("click", enviarPedido);
}

function renderMenuCliente() {

    const contenedor = document.getElementById("lista-menu-cliente");

    if (menuActivo.length === 0) {
        contenedor.innerHTML = `<div class="vacio">Todavía no hay ítems cargados en este menú</div>`;
    } else {
        contenedor.innerHTML = menuActivo.map(item => `
            <div class="menu-item">
                <div class="info">
                    <div class="nombre">${item.nombre}</div>
                    ${tipoMenuActivo === "pago" ? `<div class="precio">$${item.precio}</div>` : ""}
                </div>
                <div class="cantidad-control">
                    <button onclick="cambiarCantidad('${item.nombre}', -1)">−</button>
                    <span class="cantidad-valor" id="cant-${item.nombre.replace(/\\s+/g, "_")}">0</span>
                    <button onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
                </div>
            </div>
        `).join("");
    }

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

    if (!carrito[nombre]) carrito[nombre] = { cantidad: 0, precio: item.precio || 0 };

    carrito[nombre].cantidad = Math.max(0, carrito[nombre].cantidad + delta);

    if (carrito[nombre].cantidad === 0) delete carrito[nombre];

    const span = document.getElementById(`cant-${nombre.replace(/\s+/g, "_")}`);
    if (span) span.textContent = carrito[nombre]?.cantidad || 0;

    actualizarResumen();
}

function actualizarResumen() {
    const cantidadTotal = Object.values(carrito).reduce((s, i) => s + i.cantidad, 0);
    const total = Object.values(carrito).reduce((s, i) => s + i.cantidad * i.precio, 0);

    document.getElementById("resumen-cantidad").textContent = `${cantidadTotal} ítem${cantidadTotal === 1 ? "" : "s"}`;
    document.getElementById("resumen-total").textContent = tipoMenuActivo === "pago" ? `$${total}` : "";
}

async function enviarPedido() {

    const errorEl = document.getElementById("pedido-error");
    errorEl.textContent = "";

    const punto = document.getElementById("cliente-punto").value.trim();
    const items = Object.entries(carrito).map(([nombre, datos]) => ({
        nombre, cantidad: datos.cantidad, precio: datos.precio
    }));

    if (items.length === 0) {
        errorEl.textContent = "Elegí al menos un ítem";
        return;
    }

    if (!punto) {
        errorEl.textContent = "Indicá el número de máquina, mesa o barra";
        return;
    }

    // Control del tope diario ($50.000) para pedidos del menú sin horario
    if (tipoMenuActivo === "pago") {
        const totalPedido = items.reduce((s, i) => s + i.cantidad * i.precio, 0);

        if (tieneBeneficioGastronomia(clienteLogueado)) {
            const TOPE_DIARIO = 50000;
            const pedidosPrevios = await apiGet("/api/pedidos");
            const jornadaActual = getFechaOperativa(new Date()).getTime();

            const gastadoHoy = pedidosPrevios
                .filter(p => p.clienteId === clienteLogueado.id
                    && p.tipoMenu === "pago"
                    && getFechaOperativa(p.fechaCreacion).getTime() === jornadaActual)
                .reduce((s, p) => s + (p.total || 0), 0);

            if (gastadoHoy + totalPedido > TOPE_DIARIO) {
                errorEl.textContent = `Superás el tope diario del beneficio ($${TOPE_DIARIO}). Ya consumiste $${gastadoHoy} hoy.`;

                // Avisamos al supervisor, aunque al cliente no se le bloquea con dramatismo.
                try {
                    const clientesActuales = await apiGet("/api/clientes");
                    const c = clientesActuales.find(x => x.id === clienteLogueado.id);
                    if (c) {
                        if (!c.historial) c.historial = [];
                        c.historial.push({
                            tipo: "ALERTA_TOPE_GASTRONOMIA",
                            fecha: Date.now(),
                            motivo: `Alcanzó el tope diario de consumo ($${TOPE_DIARIO}) en gastronomía`,
                            revisada: false
                        });
                        await apiPost("/api/clientes", clientesActuales);
                    }
                } catch (error) {
                    console.error("No se pudo registrar la alerta de tope:", error);
                }

                return;
            }
        }
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
        tipoMenu: tipoMenuActivo,
        total: items.reduce((s, i) => s + i.cantidad * i.precio, 0),
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

function initVistaCierre() {
    mostrarPantalla("cierre-login");

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
        mostrarPantalla("cierre-resultado");
    });

    document.getElementById("btn-imprimir-cierre").addEventListener("click", () => window.print());
    document.getElementById("btn-volver-cierre").addEventListener("click", () => {
        mostrarPantalla("cierre-login");
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

    let totalGeneral = 0;

    contenedor.innerHTML = pedidosCierre.map(p => {
        totalGeneral += p.total || 0;
        return `
        <div class="pedido-card">
            <div style="font-weight:700; color:white;">${p.clienteNombre} — Punto ${p.punto}</div>
            <div style="color:#d4af37; font-size:13px;">
                ${p.items.map(i => `${i.cantidad}x ${i.nombre}`).join(", ")}
            </div>
            <div style="color:#999; font-size:12px; margin-top:4px;">
                ${new Date(p.horaConfirmacion).toLocaleTimeString("es-AR")}
                ${p.total ? ` · $${p.total}` : ""}
            </div>
        </div>
    `;
    }).join("") + `
        <div style="text-align:right; color:var(--dorado); font-weight:700; margin-top:10px;">
            Total: $${totalGeneral}
        </div>
    `;
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
            ["tab-menu", "tab-puntos", "tab-camareros", "tab-qr"].forEach(id => {
                document.getElementById(id).style.display = id === btn.dataset.tab ? "block" : "none";
            });
            if (btn.dataset.tab === "tab-qr") generarTodosLosQR();
        });
    });

    document.getElementById("btn-guardar-horario").addEventListener("click", async () => {
        const desde = document.getElementById("horario-desde").value;
        const hasta = document.getElementById("horario-hasta").value;
        if (!desde || !hasta) return;
        await apiPost("/api/menu?tipo=horario", { desde, hasta });
        mostrarAviso("Horario guardado");
    });

    document.getElementById("btn-agregar-beneficio").addEventListener("click", async () => {
        const nombre = document.getElementById("nuevo-item-beneficio").value.trim();
        if (!nombre) return;
        const lista = await apiGet("/api/menu?tipo=beneficio");
        lista.push({ nombre });
        await apiPost("/api/menu?tipo=beneficio", lista);
        document.getElementById("nuevo-item-beneficio").value = "";
        cargarMenuBeneficio();
    });

    document.getElementById("btn-agregar-pago").addEventListener("click", async () => {
        const nombre = document.getElementById("nuevo-item-pago").value.trim();
        const precio = Number(document.getElementById("nuevo-item-precio").value) || 0;
        if (!nombre) return;
        const lista = await apiGet("/api/menu?tipo=pago");
        lista.push({ nombre, precio });
        await apiPost("/api/menu?tipo=pago", lista);
        document.getElementById("nuevo-item-pago").value = "";
        document.getElementById("nuevo-item-precio").value = "";
        cargarMenuPago();
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

    document.getElementById("btn-agregar-camarero").addEventListener("click", async () => {
        const legajo = document.getElementById("nuevo-camarero-legajo").value.trim();
        const nombre = document.getElementById("nuevo-camarero-nombre").value.trim();
        const apellido = document.getElementById("nuevo-camarero-apellido").value.trim();
        const pinManual = document.getElementById("nuevo-camarero-pin").value.trim();

        if (!legajo || !nombre || !apellido) {
            mostrarAviso("Completá legajo, nombre y apellido");
            return;
        }

        const lista = await apiGet("/api/personal?tipo=camareros");

        if (lista.some(p => p.legajo === legajo)) {
            mostrarAviso("Ya existe un camarero con ese legajo");
            return;
        }

        lista.push({ legajo, nombre, apellido, pin: pinManual || generarPinLocal(4) });
        await apiPost("/api/personal?tipo=camareros", lista);

        document.getElementById("nuevo-camarero-legajo").value = "";
        document.getElementById("nuevo-camarero-nombre").value = "";
        document.getElementById("nuevo-camarero-apellido").value = "";
        document.getElementById("nuevo-camarero-pin").value = "";

        cargarCamareros();
    });
}

async function cargarTodoAdmin() {
    const horario = await apiGet("/api/menu?tipo=horario");
    document.getElementById("horario-desde").value = horario.desde || "20:00";
    document.getElementById("horario-hasta").value = horario.hasta || "23:59";

    await cargarMenuBeneficio();
    await cargarMenuPago();
    await cargarPuntos();
    await cargarCamareros();
}

function generarPinLocal(cantidadDigitos) {
    const min = Math.pow(10, cantidadDigitos - 1);
    const max = Math.pow(10, cantidadDigitos) - 1;
    return String(Math.floor(min + Math.random() * (max - min + 1)));
}

async function cargarCamareros() {
    const lista = await apiGet("/api/personal?tipo=camareros");
    document.getElementById("lista-camareros").innerHTML = lista.length === 0
        ? `<p style="color:#888;">Sin camareros cargados todavía</p>`
        : lista.map(p => `
            <div class="menu-item">
                <div class="info">
                    <div class="nombre">${p.nombre} ${p.apellido}</div>
                    <div class="precio">Legajo: ${p.legajo} · PIN: ${p.pin}</div>
                </div>
                <button class="btn-secundario" style="width:auto; padding:6px 12px;" onclick="borrarCamarero('${p.legajo}')">Borrar</button>
            </div>
        `).join("");
}

async function borrarCamarero(legajo) {
    let lista = await apiGet("/api/personal?tipo=camareros");
    lista = lista.filter(p => p.legajo !== legajo);
    await apiPost("/api/personal?tipo=camareros", lista);
    cargarCamareros();
}

async function cargarMenuBeneficio() {
    const lista = await apiGet("/api/menu?tipo=beneficio");
    document.getElementById("lista-menu-beneficio").innerHTML = lista.length === 0
        ? `<p style="color:#888;">Sin ítems cargados</p>`
        : lista.map((item, i) => `
            <div class="menu-item">
                <div class="info"><div class="nombre">${item.nombre}</div></div>
                <button class="btn-secundario" style="width:auto; padding:6px 12px;" onclick="borrarItemMenu('beneficio', ${i})">Borrar</button>
            </div>
        `).join("");
}

async function cargarMenuPago() {
    const lista = await apiGet("/api/menu?tipo=pago");
    document.getElementById("lista-menu-pago").innerHTML = lista.length === 0
        ? `<p style="color:#888;">Sin ítems cargados</p>`
        : lista.map((item, i) => `
            <div class="menu-item">
                <div class="info"><div class="nombre">${item.nombre}</div><div class="precio">$${item.precio}</div></div>
                <button class="btn-secundario" style="width:auto; padding:6px 12px;" onclick="borrarItemMenu('pago', ${i})">Borrar</button>
            </div>
        `).join("");
}

async function borrarItemMenu(tipo, indice) {
    const lista = await apiGet(`/api/menu?tipo=${tipo}`);
    lista.splice(indice, 1);
    await apiPost(`/api/menu?tipo=${tipo}`, lista);
    if (tipo === "beneficio") cargarMenuBeneficio(); else cargarMenuPago();
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

async function generarTodosLosQR() {
    const puntos = await apiGet("/api/puntos");
    const grid = document.getElementById("qr-grid");
    grid.innerHTML = "";

    const baseUrl = window.location.origin + window.location.pathname.replace("gastronomia.html", "gastronomia.html");

    for (const punto of puntos) {
        const url = `${baseUrl}?punto=${encodeURIComponent(punto.codigo)}`;

        const div = document.createElement("div");
        div.className = "qr-item";
        div.innerHTML = `<canvas></canvas><span>${punto.nombre}</span>`;
        grid.appendChild(div);

        const canvas = div.querySelector("canvas");
        // eslint-disable-next-line no-undef
        QRCode.toCanvas(canvas, url, { width: 120 });
    }

    if (puntos.length === 0) {
        grid.innerHTML = `<p style="color:#888;">Cargá islas, barras o mesas primero, en la pestaña "Puntos de pedido"</p>`;
    }
}

// =====================================================
// ARRANQUE SEGÚN LA VISTA
// =====================================================

// Si el QR trae un punto pre-cargado, lo completamos solo al llegar al menú
const puntoDesdeQR = params.get("punto");

if (vista === "cierre") {
    initVistaCierre();
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
