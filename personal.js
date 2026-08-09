// api/personal.js
//
// Guarda y lee dos listas chicas de personas:
// - ?tipo=lavadero  -> personal tercerizado que lava los autos (dni, nombre, pin de 4 dígitos)
// - ?tipo=empresa    -> personal de la empresa que puede autorizar un lavado (legajo, nombre, apellido, pin de 4 dígitos)
//
// Mismo patrón que api/clientes.js y api/lavados.js.

export default async function handler(req, res) {

    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        res.status(500).json({ error: "Faltan las variables de entorno de la base de datos" });
        return;
    }

    const tipo = req.query?.tipo === "empresa" ? "empresa" : "lavadero";
    const clave = tipo === "empresa" ? "personal_empresa" : "personal_lavadero";

    if (req.method === "GET") {
        try {
            const respuesta = await fetch(`${KV_URL}/get/${clave}`, {
                headers: { Authorization: `Bearer ${KV_TOKEN}` }
            });

            const datos = await respuesta.json();
            const personal = datos.result ? JSON.parse(datos.result) : [];

            res.status(200).json(personal);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo leer la base de datos" });
        }
        return;
    }

    if (req.method === "POST") {
        try {
            const personal = req.body;

            await fetch(`${KV_URL}/set/${clave}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${KV_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(personal)
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
