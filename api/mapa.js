// api/mapa.js
//
// Guarda las coordenadas de cada punto de pedido sobre la imagen del plano.
// Cada coordenada se guarda en porcentaje (0 a 100), no en píxeles, para que
// funcione igual sin importar el tamaño de pantalla donde se vea el plano.

export default async function handler(req, res) {

    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        res.status(500).json({ error: "Faltan las variables de entorno de la base de datos" });
        return;
    }

    if (req.method === "GET") {
        try {
            const respuesta = await fetch(`${KV_URL}/get/mapa_coordenadas`, {
                headers: { Authorization: `Bearer ${KV_TOKEN}` }
            });

            const datos = await respuesta.json();
            const coordenadas = datos.result ? JSON.parse(datos.result) : [];

            res.status(200).json(coordenadas);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "No se pudo leer la base de datos" });
        }
        return;
    }

    if (req.method === "POST") {
        try {
            const coordenadas = req.body;

            await fetch(`${KV_URL}/set/mapa_coordenadas`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${KV_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(coordenadas)
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
