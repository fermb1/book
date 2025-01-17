import express from "express";
import createPage from "../controllers/createpage.controller.js"; // Ajusta la ruta al archivo
import getPages from "../controllers/getpages.controller.js";
import { deletePage } from "../controllers/deletePage.controller.js";
const router = express.Router();

// Ruta para crear una nueva página
router.post('/create', createPage);
router.get('/all', getPages);
router.post('/update', async (req, res) => {
    const { id, text } = req.body;
    if (!id || !text) {
      return res.status(400).json({ error: 'ID y texto son obligatorios.' });
    }
  
    try {
      const updatedPage = await Pag.findByIdAndUpdate(id, { text }, { new: true });
      if (!updatedPage) {
        return res.status(404).json({ error: 'Página no encontrada.' });
      }
      res.json(updatedPage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar la página.' });
    }
  });
  router.delete('/delete/:id', deletePage)

export default router;
