import { Router } from "express";
import { TiposUsuarioController } from "../controllers/enumsController";

const router = Router();

// Obtener todos los tipos de documento con formato completo
router.get("/tipoDocumento", TiposUsuarioController.getAllTiposDocumento);

// Obtener solo los valores del enum
router.get("/tipoUsuarios", TiposUsuarioController.getAllTiposUsuario);

// Obtener solo las claves del enum
router.get("/sexos", TiposUsuarioController.getAllSex);

export default router;
