import { Request, Response } from "express";
import { TipoDocumento } from "../models/Persona";
import { BaseService } from "../services/BaseService";

export class TiposDocumentoController {
    static async getAllTiposDocumento(req: Request, res: Response) {
        try {
            // Convertir el enum a un array de objetos con id y nombre
            const tiposDocumento = Object.entries(TipoDocumento).map(([key, value], index) => ({
                id: index + 1,
                key: key,
                value: value,
                nombre: value // Para mantener compatibilidad con el frontend
            }));

            res.status(200).json(tiposDocumento);
        } catch (error) {
            console.error("Error al obtener los tipos de documento:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Método adicional para obtener solo los valores del enum
    static async getTiposDocumentoValues(req: Request, res: Response) {
        try {
            const valores = Object.values(TipoDocumento);
            return BaseService.success(res, valores, "Valores de tipos de documento obtenidos exitosamente", valores.length);
        } catch (error) {
            console.error("Error al obtener los valores de tipos de documento:", error);
            return BaseService.serverError(res, "Error interno del servidor");
        }
    }

    // Método adicional para obtener las claves del enum
    static async getTiposDocumentoKeys(req: Request, res: Response) {
        try {
            const claves = Object.keys(TipoDocumento);
            res.status(200).json(claves);
        } catch (error) {
            console.error("Error al obtener las claves de tipos de documento:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}
