import express, { json } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import pageroutes from './routes/page.routes.js'; // Importa las rutas de páginas
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
import cors from 'cors';
import mongoose from 'mongoose'; // Importamos mongoose para validación del ID
// Conexión a la base de datos
connectDB();
import Pag from './models/Pag.model.js';
// Middlewares
app.use(
  cors({
    origin: 'http://localhost:5173', // Origen permitido
    credentials: true,               // Permite cookies y encabezados de autorización
  })
);
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/pages", pageroutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.send('Bienvenido a la página principal');
});

// Ruta PUT para actualizar la página
app.put('/api/pages/:id', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  // Validar que el texto esté presente
  if (!text) {
    return res.status(400).json({ success: false, message: "Text is required" });
  }

  try {
    // Validar si el ID de la página es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid page ID" });
    }

    // Buscar y actualizar la página
    const updatedPage = await Pag.findByIdAndUpdate(
      id,
      { text }, // El texto que queremos actualizar
      { new: true } // Retornar el documento actualizado
    );

    if (!updatedPage) {
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    // Responder con el documento actualizado
    res.json({ success: true, message: "Page updated successfully", page: updatedPage });
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ success: false, message: "Error updating page" });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:` + PORT);
});

console.log(process.env.PORT);
