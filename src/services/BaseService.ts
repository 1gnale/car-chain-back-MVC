import { Request, Response } from 'express';
import { Result } from 'express-validator';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  count?: number;
}

export class BaseService {
  
  // Respuesta exitosa estándar
  static success<T>(res: Response, data?: T, message?: string, count?: number): Response {
    const response: ApiResponse<T> = {
      success: true,
      ...(message && { message }),
      ...(data !== undefined && { data }),
      ...(count !== undefined && { count })
    };
    
    return res.status(200).json(response);
  }

  // Respuesta de creación exitosa
  static created<T>(res: Response, data: T, message: string = 'Recurso creado exitosamente'): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data
    };
    
    return res.status(201).json(response);
  }

  // Respuesta de error de validación
  static validationError(res: Response, errors: Result): Response {
    const response: ApiResponse = {
      success: false,
      message: 'Error de validación',
      errors: errors.array()
    };
    
    return res.status(400).json(response);
  }

  // Respuesta de recurso no encontrado
  static notFound(res: Response, message: string = 'Recurso no encontrado'): Response {
    const response: ApiResponse = {
      success: false,
      message
    };
    
    return res.status(404).json(response);
  }

  // Respuesta de error del servidor
  static serverError(res: Response, error: any, message: string = 'Error interno del servidor'): Response {
    console.error('Server Error:', error);
    
    const response: ApiResponse = {
      success: false,
      message: process.env.NODE_ENV === 'production' ? message : error.message,
      ...(process.env.NODE_ENV !== 'production' && { errors: [error] })
    };
    
    return res.status(500).json(response);
  }

  // Respuesta de conflicto (ej: recurso duplicado)
  static conflict(res: Response, message: string = 'El recurso ya existe'): Response {
    const response: ApiResponse = {
      success: false,
      message
    };
    
    return res.status(409).json(response);
  }

  // Respuesta de error de autorización
  static unauthorized(res: Response, message: string = 'No autorizado'): Response {
    const response: ApiResponse = {
      success: false,
      message
    };
    
    return res.status(401).json(response);
  }

  // Respuesta de error de prohibido
  static forbidden(res: Response, message: string = 'Acceso prohibido'): Response {
    const response: ApiResponse = {
      success: false,
      message
    };
    
    return res.status(403).json(response);
  }
}
