import Pag from "../models/Pag.model.js";

const getPages = async (req, res) => {
    try {
        const pages = await Pag.find();
        res.status(200).json(pages)
    } catch (err) {
        console.error("error al obtener las paginas", err)
        res.status(500).json({error: "error al obtener las paginas"})
    }
}
export default getPages