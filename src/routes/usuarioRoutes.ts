import { Router } from "express";
import { UsuariosController } from "../controllers/usuariosController";
const router = Router();

router.get("/", UsuariosController.getAllUsuarios );
router.post("/create-user", UsuariosController.createUsuario );
router.put("/update-user-state/:legajo", UsuariosController.updateUsuarioState );
router.get("/get-user-by-id/:legajo", UsuariosController.getUserById );
router.put("/update-user/:legajo", UsuariosController.updateUser );

export default router;
