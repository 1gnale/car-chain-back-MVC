import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import sequelize from "./config/database";

// Importar rutas
import provinciaRoutes from "./routes/provinciaRoutes";
import localidadRoutes from "./routes/localidadRoutes";
import personaRoutes from "./routes/personaRoutes";
import usuarioRoutes from "./routes/usuarioRoutes";
import clienteRoutes from "./routes/clienteRoutes";
import marcaRoutes from "./routes/marcaRoutes";
import modeloRoutes from "./routes/modeloRoutes";
import versionRoutes from "./routes/versionRoutes";
import detalleRoutes from "./routes/detalleRoutes";
import coberturaRoutes from "./routes/coberturaRoutes";
import coberturaDetalleRoutes from "./routes/coberturaDetalleRoutes";
import configuracionEdadRoutes from "./routes/configuracionEdadRoutes";
import configuracionAntiguedadRoutes from "./routes/configuracionAntiguedadRoutes";
import configuracionLocalidadRoutes from "./routes/configuracionLocalidadRoutes";
import periodoPagoRoutes from "./routes/periodoPagoRoutes";
import tipoContratacionRoutes from "./routes/tipoContratacionRoutes";
import vehiculoCotizacionRoutes from "./routes/vehiculoCotizacionRoutes";
import polizaRoutes from "./routes/polizaRoutes";

import { Cobertura, Detalle, CoberturaDetalle, Cotizacion } from "./models";

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Middlewares de logging y parsing
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rutas de la API
app.use("/api/provincias", provinciaRoutes);
app.use("/api/localidades", localidadRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/marcas", marcaRoutes);
app.use("/api/modelos", modeloRoutes);
app.use("/api/versiones", versionRoutes);
app.use("/api/detalle", detalleRoutes);
app.use("/api/cobertura", coberturaRoutes);
app.use("/api/coberturaDetalle", coberturaDetalleRoutes);
app.use("/api/configuracionEdad", configuracionEdadRoutes);
app.use("/api/configuracionAntiguedad", configuracionAntiguedadRoutes);
app.use("/api/configuracionLocalidad", configuracionLocalidadRoutes);
app.use("/api/periodoPago", periodoPagoRoutes);
app.use("/api/tipoContratacion", tipoContratacionRoutes);
app.use("/api/vehiculoCotizacion", vehiculoCotizacionRoutes);
app.use("/api/poliza", polizaRoutes);

// Ruta de health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// Manejo global de errores
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      error:
        process.env.NODE_ENV === "production"
          ? "Error interno del servidor"
          : err.message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
  }
);

// Función para inicializar la aplicación
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente");
    console.log("Cotizacion");
    console.log(Cotizacion.associations);

    const asociaciones = Cotizacion.associations;

    for (const key in asociaciones) {
      const asoc = asociaciones[key];
      console.log("Asociación:", key);
      console.log("Tipo:", asoc.associationType);
      console.log("ForeignKey:", asoc.foreignKey);

      // Atributos del modelo asociado
      console.log("Atributos del modelo asociado:");
      console.log(Object.keys(asoc.target.getAttributes()));
    }

    //  Sincronizar modelos (solo en desarrollo)
    // if (process.env.NODE_ENV === "development") {
    // await sequelize.sync({ alter: true });
    //console.log("✅ Modelos sincronizados con la base de datos");
    //}

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Error al inicializar la aplicación:", error);
    process.exit(1);
  }
};

// Inicializar la aplicación
startServer();

export default app;
