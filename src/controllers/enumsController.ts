import { Request, Response } from "express";
import { TipoUsuario } from "../models/Usuario";
import { sexo, TipoDocumento } from "../models/Persona";
import { BaseService } from "../services/BaseService";

export class TiposUsuarioController {
  static async getAllTiposUsuario(req: Request, res: Response) {
    try {
      // Convertir el enum a un array de objetos con id y nombre
      const tiposUsuario = Object.values(TipoUsuario);
      return BaseService.success(
        res,
        tiposUsuario,
        "Tipos de usuario obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener los tipos de usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async getAllTiposDocumento(req: Request, res: Response) {
    try {
      // Convertir el enum a un array de objetos con id y nombre
      const tiposDocumento = Object.values(TipoDocumento);

      return BaseService.success(
        res,
        tiposDocumento,
        "Tipos de documento obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener los tipos de documento:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async getAllSex(req: Request, res: Response) {
    try {
      // Convertir el enum a un array de objetos con id y nombre
      const sexos = Object.entries(sexo).map(([key, value], index) => ({
        id: index + 1,
        name: value,
      }));

      return BaseService.success(res, sexos, "Sexos obtenidos exitosamente");
    } catch (error) {
      console.error("Error al obtener los tipos de documento:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}
