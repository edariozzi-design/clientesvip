// api/clientes.js
//
// Esta función corre en el servidor de Vercel (no en el navegador),
// así que es el único lugar donde se usan las claves secretas de la base de datos.
// El script.js del navegador solo le habla a esta función mediante fetch("/api/clientes"),
// nunca habla directo con la base de datos.

export default async function handler(req, res) {

    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        res.status(500).json({ error: "Faltan las variables de entorno de la base de datos" });
        return;
    }

    // --- LEER LOS CLIENTES ---
    if (req.method === "GET") {
        try {
            const respuesta = await fetch(`${KV_URL}/get/clientes`, {
                headers: { Authorization: `Bearer ${KV_TOKEN}` }
            });

            const datos = await respuesta.json();
            const clientes = datos.result ? JSON.parse(datos.result) : [];

            res.status(200).json(clientes);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo leer la base de datos" });
        }
        return;
    }

    // --- GUARDAR LOS CLIENTES (reemplaza todo el listado) ---
    if (req.method === "POST") {
        try {
            const clientes = req.body;

            await fetch(`${KV_URL}/set/clientes`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${KV_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(clientes)
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
