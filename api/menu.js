// api/menu.js
//
// Guarda el menú de gastronomía (por ahora, un solo menú: el de beneficio,
// el de la carta real). Se organiza en categorías, y cada categoría dice si
// está siempre disponible o si depende de los horarios cargados.
//
// - ?tipo=items       -> lista de ítems del menú [{nombre, categoria}]
// - ?tipo=categorias  -> lista de categorías [{nombre, siempreDisponible}]
// - ?tipo=horarios    -> lista de franjas horarias [{nombre, desde, hasta}]

export default async function handler(req, res) {

    const KV_URL = process.env.KV_REST_API_URL;
    const KV_TOKEN = process.env.KV_REST_API_TOKEN;

    if (!KV_URL || !KV_TOKEN) {
        res.status(500).json({ error: "Faltan las variables de entorno de la base de datos" });
        return;
    }

    const tipo = req.query?.tipo === "categorias" ? "categorias"
        : req.query?.tipo === "horarios" ? "horarios"
        : "items";

    const clave = tipo === "categorias" ? "menu_categorias"
        : tipo === "horarios" ? "menu_horarios"
        : "menu_items";

    if (req.method === "GET") {
        try {
            const respuesta = await fetch(`${KV_URL}/get/${clave}`, {
                headers: { Authorization: `Bearer ${KV_TOKEN}` }
            });

            const datos = await respuesta.json();
            const valor = datos.result ? JSON.parse(datos.result) : [];

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
