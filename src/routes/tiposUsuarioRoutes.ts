import { Router } from "express";
import { TiposUsuarioController } from "../controllers/tiposUsuarioController";

const router = Router();

// Obtener todos los tipos de usuario con formato completo
router.get("/", TiposUsuarioController.getAllTiposUsuario);

// Obtener solo los valores del enum
router.get("/values", TiposUsuarioController.getTiposUsuarioValues);

// Obtener solo las claves del enum
router.get("/keys", TiposUsuarioController.getTiposUsuarioKeys);

// Obtener información detallada con permisos
router.get("/detallado", TiposUsuarioController.getTiposUsuarioDetallado);

export default router;