import { Router } from "express";
import { TiposDocumentoController } from "../controllers/tiposDocumentoController";

const router = Router();

// Obtener todos los tipos de documento con formato completo
router.get("/", TiposDocumentoController.getAllTiposDocumento);

// Obtener solo los valores del enum
router.get("/values", TiposDocumentoController.getTiposDocumentoValues);

// Obtener solo las claves del enum
router.get("/keys", TiposDocumentoController.getTiposDocumentoKeys);

export default router;