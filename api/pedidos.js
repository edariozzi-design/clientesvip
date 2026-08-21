// api/pedidos.js
//
// Guarda los pedidos de gastronomía. Mismo patrón que api/lavados.js.

export default async function handler(req, res) {

    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        res.status(500).json({ error: "Faltan las variables de entorno de la base de datos" });
        return;
    }

    if (req.method === "GET") {
        try {
            const respuesta = await fetch(`${KV_URL}/get/pedidos`, {
                headers: { Authorization: `Bearer ${KV_TOKEN}` }
            });

            const datos = await respuesta.json();
            const pedidos = datos.result ? JSON.parse(datos.result) : [];

            res.status(200).json(pedidos);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo leer la base de datos" });
        }
        return;
    }

    if (req.method === "POST") {
        try {
            const pedidos = req.body;

            await fetch(`${KV_URL}/set/pedidos`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${KV_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(pedidos)
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
