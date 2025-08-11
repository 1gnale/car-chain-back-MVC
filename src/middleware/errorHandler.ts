import { Request, Response, NextFunction } from 'express';

// Middleware para validación de errores
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Error de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.errors.map((error: any) => ({
        field: error.path,
        message: error.message
      }))
    });
  }

  // Error de constrainte de base de datos
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'El recurso ya existe',
      field: err.errors[0]?.path
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

// Middleware para rutas no encontradas
export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
};
