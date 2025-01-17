import Pag from "../models/Pag.model.js";

export const deletePage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPage = await Pag.findByIdAndDelete(id);
        if (!deletePage) {
            return res.status(404).json({ error: 'pagina no encontrada'})
        }
        res.status(200).json({message: 'pagina eliminada correctamente'})
    } catch (error) {
        cconsole.error('error al eliminar la pagina: ', error)
        res.status(500).json({ error: 'error al eliminar la pagina'})
    }
}