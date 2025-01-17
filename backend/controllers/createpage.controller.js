import Pag from "../models/Pag.model.js"; // Asegúrate de usar la ruta correcta

const createPage = async (req, res) => {
    try {
        const { title, text, category } = req.body;

        // Validación básica
        if (!title || !text || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Crear una nueva página
        const nuevoPag = new Pag({
            title,
            text,
            category
        });

        // Guardar en la base de datos
        const savedPag = await nuevoPag.save();

        res.status(201).json({ message: "Página creada con éxito", page: savedPag });
    } catch (err) {
        console.error("Error al guardar la página:", err);
        res.status(500).json({ error: "Error al guardar la página" });
    }
};

export default createPage;
