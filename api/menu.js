// api/menu.js
//
// Guarda los 2 menús de gastronomía:
// - "beneficio" (con horario, sin precios)
// - "pago" (sin horario, con precios)
// Y la configuración de horario del menú beneficio.

export default async function handler(req, res) {

    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        res.status(500).json({ error: "Faltan las variables de entorno de la base de datos" });
        return;
    }

    const tipo = req.query?.tipo === "pago" ? "pago"
        : req.query?.tipo === "horario" ? "horario"
        : "beneficio";

    const clave = tipo === "pago" ? "menu_pago"
        : tipo === "horario" ? "menu_horario"
        : "menu_beneficio";

    if (req.method === "GET") {
        try {
            const respuesta = await fetch(`${KV_URL}/get/${clave}`, {
                headers: { Authorization: `Bearer ${KV_TOKEN}` }
            });

            const datos = await respuesta.json();
            const valor = datos.result ? JSON.parse(datos.result) : (tipo === "horario" ? { desde: "20:00", hasta: "23:59" } : []);

            res.status(200).json(valor);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo leer la base de datos" });
        }
        return;
    }

    if (req.method === "POST") {
        try {
            const valor = req.body;

            await fetch(`${KV_URL}/set/${clave}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${KV_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(valor)
            });

            res.status(200).json({ ok: true });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo guardar en la base de datos" });
        }
        return;
    }

    res.status(405).json({ error: "Método no permitido" });
}
