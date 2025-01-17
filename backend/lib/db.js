import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true  // Solo esta opción es necesaria
        });
        
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error conectando a MongoDB:", error.message);
        process.exit(1); // Salir del proceso con error
    }
};
