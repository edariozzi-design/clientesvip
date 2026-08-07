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

        renderAlertas();

        estadoConexion.textContent = "Actualizado " + new Date().toLocaleTimeString("es-AR");

    } catch (error) {
        estadoConexion.textContent = "Sin conexión, mostrando lo último cargado";
        console.error(error);
    }
}

function getAlertasPendientes() {

    const alertas = [];

    clientesCache.forEach(cliente => {
        (cliente.historial || []).forEach((evento, index) => {

            if (!evento.tipo || !evento.tipo.startsWith("ALERTA_")) return;
            if (evento.revisada) return;

            alertas.push({
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

    return alertas.sort((a, b) => b.fecha - a.fecha);
}

function renderAlertas() {

    const alertas = getAlertasPendientes();

    if (alertas.length === 0) {
        listaAlertas.innerHTML = "";
        sinAlertas.style.display = "block";
        return;
    }

    sinAlertas.style.display = "none";

    listaAlertas.innerHTML = alertas.map(a => `
        <div class="alerta-card">
            <div class="tipo">${a.nombreTipo}</div>
            <div class="cliente">${a.clienteNombre}</div>
            <div class="motivo">${a.motivo}</div>
            <div class="fecha">${new Date(a.fecha).toLocaleString("es-AR")}</div>
            <button onclick="marcarRevisada('${a.clienteId}', ${a.indice})">
                Marcar como revisada
            </button>
        </div>
    `).join("");
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
