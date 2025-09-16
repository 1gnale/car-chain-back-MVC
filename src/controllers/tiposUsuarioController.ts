import { Request, Response } from "express";
import { TipoUsuario } from "../models/Usuario";

export class TiposUsuarioController {
    static async getAllTiposUsuario(req: Request, res: Response) {
        try {
            // Convertir el enum a un array de objetos con id y nombre
            const tiposUsuario = Object.entries(TipoUsuario).map(([key, value], index) => ({
                id: index + 1,
                key: key,
                value: value,
                nombre: value, // Para mantener compatibilidad con el frontend
                descripcion: getTipoUsuarioDescription(value) // Descripción amigable
            }));

            res.status(200).json(tiposUsuario);
        } catch (error) {
            console.error("Error al obtener los tipos de usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Método adicional para obtener solo los valores del enum
    static async getTiposUsuarioValues(req: Request, res: Response) {
        try {
            const valores = Object.values(TipoUsuario);
            res.status(200).json(valores);
        } catch (error) {
            console.error("Error al obtener los valores de tipos de usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Método adicional para obtener las claves del enum
    static async getTiposUsuarioKeys(req: Request, res: Response) {
        try {
            const claves = Object.keys(TipoUsuario);
            res.status(200).json(claves);
        } catch (error) {
            console.error("Error al obtener las claves de tipos de usuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    // Método para obtener información detallada de cada tipo
    static async getTiposUsuarioDetallado(req: Request, res: Response) {
        try {
            const tiposDetallados = Object.entries(TipoUsuario).map(([key, value], index) => ({
                id: index + 1,
                key: key,
                value: value,
                nombre: value,
                descripcion: getTipoUsuarioDescription(value),
                permisos: getTipoUsuarioPermissions(value),
                activo: true // Todos los tipos están activos por defecto
            }));

            res.status(200).json(tiposDetallados);
        } catch (error) {
            console.error("Error al obtener los tipos de usuario detallados:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

// Función helper para obtener descripciones amigables
function getTipoUsuarioDescription(tipo: TipoUsuario): string {
    const descripciones = {
        [TipoUsuario.ADMINISTRADOR]: "Usuario con acceso completo al sistema",
        [TipoUsuario.VENDEDOR]: "Usuario especializado en ventas y cotizaciones",
        [TipoUsuario.PERITO]: "Usuario especializado en evaluación de siniestros",
        [TipoUsuario.GESTOR_DE_SINIESTROS]: "Usuario especializado en gestión de siniestros"
    };
    
    return descripciones[tipo] || "Tipo de usuario no definido";
}

// Función helper para obtener permisos básicos (ejemplo)
function getTipoUsuarioPermissions(tipo: TipoUsuario): string[] {
    const permisos = {
        [TipoUsuario.ADMINISTRADOR]: [
            "crear_usuarios", "editar_usuarios", "eliminar_usuarios",
            "ver_reportes", "configurar_sistema", "gestionar_polizas"
        ],
        [TipoUsuario.VENDEDOR]: [
            "crear_cotizaciones", "ver_clientes", "gestionar_ventas"
        ],
        [TipoUsuario.PERITO]: [
            "evaluar_siniestros", "crear_reportes_peritaje", "ver_polizas"
        ],
        [TipoUsuario.GESTOR_DE_SINIESTROS]: [
            "gestionar_siniestros", "aprobar_pagos", "ver_reportes_siniestros"
        ]
    };
    
    return permisos[tipo] || [];
}