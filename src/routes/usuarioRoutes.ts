import { Router } from "express";
import { UsuariosController } from "../controllers/usuariosController";
import { usuariosValidation } from "../utils/validationsUsuarios";
import { handleValidationErrors } from "../middleware/validation";

const router = Router();

router.get("/", 
  usuariosValidation.getAll, 
  handleValidationErrors, 
  UsuariosController.getAllUsuarios
);

router.post("/create-user", 
  usuariosValidation.create, 
  handleValidationErrors, 
  UsuariosController.createUsuario
);

router.put("/update-user-state/:legajo", 
  usuariosValidation.updateState, 
  handleValidationErrors, 
  UsuariosController.updateUsuarioState
);

router.get("/get-user-by-id/:legajo", 
  usuariosValidation.getById, 
  handleValidationErrors, 
  UsuariosController.getUserById
);

router.put("/update-user/:legajo", 
  usuariosValidation.update, 
  handleValidationErrors, 
  UsuariosController.updateUser
);

export default router;
