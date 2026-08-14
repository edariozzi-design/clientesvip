// alertas-supervisor.js
//
// Página independiente, pensada para el celular del supervisor.
// Solo lee y marca alertas. No toca nada del sistema principal (script.js).
// Usa la misma api/clientes.js que ya está funcionando.

// ⚠️ IMPORTANTE: poné acá la MISMA contraseña que ya tenés configurada
// en tu script.js principal, en la constante `supervisor.pass`.
const SUPERVISOR_PASS = "";

const NOMBRES_ALERTA = {
    ALERTA_PROHIBICION: "Prohibición activa",
    ALERTA_AUTOEXCLUSION: "Autoexclusión activa",
    ALERTA_NOVEDAD: "Novedad pendiente",
    ALERTA_NO_SOCIO: "Ingreso de no socio",
    ALERTA_MANUAL: "Alerta del supervisor"
};

let clientesCache = [];

function actualizarReloj() {
    const ahora = new Date();

    const hora = ahora.toLocaleTimeString("es-AR", { hour12: false });
    const fecha = ahora.toLocaleDateString("es-AR");

    const reloj = document.getElementById("reloj-digital");
    const fechaTexto = document.getElementById("fecha-digital");

    if (reloj) reloj.textContent = hora;
    if (fechaTexto) fechaTexto.textContent = fecha;
}

actualizarReloj();
setInterval(actualizarReloj, 1000);

const pantallaLogin = document.getElementById("pantalla-login");
const pantallaAlertas = document.getElementById("pantalla-alertas");
const inputPass = document.getElementById("input-pass");
const errorLogin = document.getElementById("error-login");
const listaAlertas = document.getElementById("lista-alertas");
const sinAlertas = document.getElementById("sin-alertas");
const estadoConexion = document.getElementById("estado-conexion");

document.getElementById("btn-entrar").addEventListener("click", intentarLogin);
inputPass.addEventListener("keydown", e => {
    if (e.key === "Enter") intentarLogin();
});

function intentarLogin() {
    if (inputPass.value === SUPERVISOR_PASS) {
        pantallaLogin.style.display = "none";
        pantallaAlertas.style.display = "block";
        cargarAlertas();
        setInterval(cargarAlertas, 15000); // se actualiza sola cada 15s
    } else {
        errorLogin.textContent = "Contraseña incorrecta";
    }
}

document.getElementById("btn-actualizar").addEventListener("click", cargarAlertas);

async function cargarAlertas() {

    estadoConexion.textContent = "Actualizando...";

    try {
        const respuesta = await fetch("/api/clientes");
        const datos = await respuesta.json();

        clientesCache = Array.isArray(datos) ? datos : [];

        await renderAlertas();

        estadoConexion.textContent = "Actualizado " + new Date().toLocaleTimeString("es-AR");

    } catch (error) {
        estadoConexion.textContent = "Sin conexión, mostrando lo último cargado";
        console.error(error);
    }
}

let lavadosCache = [];

async function getAlertasPendientes() {

    const alertas = [];

    clientesCache.forEach(cliente => {
        (cliente.historial || []).forEach((evento, index) => {

            if (!evento.tipo || !evento.tipo.startsWith("ALERTA_")) return;
            if (evento.revisada) return;

            alertas.push({
                origen: "cliente",
                clienteId: cliente.id,
                clienteNombre: cliente.nombre,
                indice: index,
                tipo: evento.tipo,
                nombreTipo: NOMBRES_ALERTA[evento.tipo] || evento.tipo,
                motivo: evento.motivo || "",
                fecha: evento.fecha
            });
        });
    });

    try {
        const respuesta = await fetch("/api/lavados");
        lavadosCache = await respuesta.json();

        (Array.isArray(lavadosCache) ? lavadosCache : [])
            .filter(l => l.estado === "pendiente")
            .forEach(l => {
                alertas.push({
                    origen: "lavado",
                    pedidoId: l.id,
                    clienteNombre: l.clienteNombre,
                    tipo: "LAVADO_PENDIENTE",
                    nombreTipo: "Lavado pendiente de autorizar",
                    motivo: `${l.modelo} — ${l.patente}`,
                    fecha: l.fechaCreacion
                });
            });

    } catch (error) {
        console.error("No se pudieron cargar los lavados pendientes:", error);
    }

    return alertas.sort((a, b) => b.fecha - a.fecha);
}

async function renderAlertas() {

    const alertas = await getAlertasPendientes();

    if (alertas.length === 0) {
        listaAlertas.innerHTML = "";
        sinAlertas.style.display = "block";
        return;
    }

    sinAlertas.style.display = "none";

    listaAlertas.innerHTML = alertas.map(a => {

        const boton = a.origen === "lavado"
            ? `<button onclick="abrirModalAutorizarLavado('${a.pedidoId}')">Autorizar</button>`
            : `<button onclick="marcarRevisada('${a.clienteId}', ${a.indice})">Marcar como revisada</button>`;

        return `
        <div class="alerta-card">
            <div class="tipo">${a.nombreTipo}</div>
            <div class="cliente">${a.clienteNombre}</div>
            <div class="motivo">${a.motivo}</div>
            <div class="fecha">${new Date(a.fecha).toLocaleString("es-AR")}</div>
            ${boton}
        </div>
    `;
    }).join("");
}

async function marcarRevisada(clienteId, indice) {

    const cliente = clientesCache.find(c => c.id === clienteId);
    if (!cliente || !cliente.historial || !cliente.historial[indice]) return;

    cliente.historial[indice].revisada = true;

    renderAlertas(); // respuesta visual inmediata

    try {
        await fetch("/api/clientes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(clientesCache)
        });
    } catch (error) {
        console.error("No se pudo guardar en el servidor:", error);
        estadoConexion.textContent = "No se pudo guardar, reintentá";
    }
}

function abrirModalAutorizarLavado(pedidoId) {

    document.getElementById("modal-autorizar-lavado")?.remove();

    const overlay = document.createElement("div");
    overlay.id = "modal-autorizar-lavado";
    overlay.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.75);
        display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;
    `;

    overlay.innerHTML = `
        <div class="card-login" style="width:100%; max-width:320px; margin:0;">
            <h1 style="color:var(--dorado); font-size:20px; margin-bottom:14px;">Autorizar lavado</h1>
            <input type="text" id="autorizar-legajo-modal" placeholder="Legajo" inputmode="numeric">
            <input type="password" id="autorizar-pin-modal" placeholder="PIN" inputmode="numeric" maxlength="4">
            <div id="autorizar-lavado-error" style="color:#ff6b6b; font-size:13px; min-height:18px; margin-bottom:8px;"></div>
            <button class="btn-principal" id="btn-confirmar-autorizar-lavado" style="margin-bottom:8px;">Autorizar</button>
            <button class="btn-secundario" id="btn-cancelar-autorizar-lavado">Cancelar</button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("btn-cancelar-autorizar-lavado").addEventListener("click", () => overlay.remove());
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });

    document.getElementById("btn-confirmar-autorizar-lavado").addEventListener("click", async () => {

        const legajo = document.getElementById("autorizar-legajo-modal").value.trim();
        const pin = document.getElementById("autorizar-pin-modal").value.trim();
        const errorEl = document.getElementById("autorizar-lavado-error");

        if (!legajo || !pin) {
            errorEl.textContent = "Completá legajo y PIN";
            return;
        }

        try {
            const personal = await (await fetch("/api/personal?tipo=empresa")).json();
            const persona = personal.find(p => String(p.legajo) === legajo && String(p.pin) === pin);

            if (!persona) {
                errorEl.textContent = "Legajo o PIN incorrecto";
                return;
            }

            const lavados = await (await fetch("/api/lavados")).json();
            const pedido = lavados.find(l => l.id === pedidoId);

            if (!pedido) {
                errorEl.textContent = "El pedido ya no existe (¿alguien más lo autorizó?)";
                return;
            }

            pedido.estado = "autorizado";
            pedido.autorizadoPorLegajo = persona.legajo;
            pedido.autorizadoPorApellido = persona.apellido;
            pedido.horaAutorizacion = Date.now();

            await fetch("/api/lavados", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(lavados)
            });

            overlay.remove();
            renderAlertas();

        } catch (error) {
            errorEl.textContent = "No se pudo autorizar, probá de nuevo";
            console.error(error);
        }
    });
}
