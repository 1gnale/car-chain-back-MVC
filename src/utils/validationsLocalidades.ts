import { body, param, query } from 'express-validator';

export const localidadesValidation = {
  // Validación para crear localidad
  create: [
    body('descripcion')
      .notEmpty()
      .withMessage('La descripción es requerida')
      .isLength({ min: 2, max: 50 })
      .withMessage('La descripción debe tener entre 2 y 50 caracteres')
      .trim(),
    
    body('codigoPostal')
      .notEmpty()
      .withMessage('El código postal es requerido')
      .isLength({ min: 4, max: 10 })
      .withMessage('El código postal debe tener entre 4 y 10 caracteres')
      .matches(/^[A-Z0-9]+$/)
      .withMessage('El código postal debe contener solo letras mayúsculas y números')
      .trim(),
    
    body('provincia_id')
      .isInt({ min: 1 })
      .withMessage('El ID de provincia debe ser un número entero positivo'),
    
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El estado activo debe ser verdadero o falso')
      .toBoolean()
  ],

  // Validación para actualizar localidad
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo'),
    
    body('descripcion')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('La descripción debe tener entre 2 y 50 caracteres')
      .trim(),
    
    body('codigoPostal')
      .optional()
      .isLength({ min: 4, max: 10 })
      .withMessage('El código postal debe tener entre 4 y 10 caracteres')
      .matches(/^[A-Z0-9]+$/)
      .withMessage('El código postal debe contener solo letras mayúsculas y números')
      .trim(),
    
    body('provincia_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID de provincia debe ser un número entero positivo'),
    
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El estado activo debe ser verdadero o falso')
      .toBoolean()
  ],

  // Validación para actualizar estado
  updateEstado: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo'),
    
    body('activo')
      .isBoolean()
      .withMessage('El estado activo debe ser verdadero o falso')
      .toBoolean()
  ],

  // Validación para obtener por ID
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo')
  ],

  // Validación para obtener por provincia
  getByProvincia: [
    param('provinciaId')
      .isInt({ min: 1 })
      .withMessage('El ID de provincia debe ser un número entero positivo'),
    
    query('activo')
      .optional()
      .isBoolean()
      .withMessage('El filtro activo debe ser verdadero o falso')
      .toBoolean()
  ],

  // Validación para búsqueda por código postal
  getByCodigoPostal: [
    param('codigoPostal')
      .notEmpty()
      .withMessage('El código postal es requerido')
      .isLength({ min: 4, max: 10 })
      .withMessage('El código postal debe tener entre 4 y 10 caracteres')
      .matches(/^[A-Z0-9]+$/)
      .withMessage('El código postal debe contener solo letras mayúsculas y números')
      .trim()
  ],

  // Validación para consultas con filtros
  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La página debe ser un número entero positivo'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('El límite debe ser un número entre 1 y 100'),
    
    query('search')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('El término de búsqueda debe tener entre 1 y 100 caracteres')
      .trim(),
    
    query('provincia_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID de provincia debe ser un número entero positivo'),
    
    query('activo')
      .optional()
      .isBoolean()
      .withMessage('El filtro activo debe ser verdadero o falso')
      .toBoolean(),
    
    query('codigoPostal')
      .optional()
      .isLength({ min: 4, max: 10 })
      .withMessage('El código postal debe tener entre 4 y 10 caracteres')
      .matches(/^[A-Z0-9]+$/)
      .withMessage('El código postal debe contener solo letras mayúsculas y números')
      .trim()
  ]
};