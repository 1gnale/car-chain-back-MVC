import { body, param, query } from 'express-validator';

export const provinciaValidation = {
  // Validación para crear provincia
  create: [
    body('descripcion')
      .notEmpty()
      .withMessage('La descripción de la provincia es requerida')
      .isLength({ min: 2, max: 100 })
      .withMessage('La descripción debe tener entre 2 y 100 caracteres')
      .trim()
  ],

  // Validación para actualizar provincia
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo'),
    body('descripcion')
      .notEmpty()
      .withMessage('La descripción de la provincia es requerida')
      .isLength({ min: 2, max: 100 })
      .withMessage('La descripción debe tener entre 2 y 100 caracteres')
      .trim()
  ],

  // Validación para obtener por ID
  getById: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo')
  ],

  // Validación para eliminar
  delete: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo')
  ]
};

export const personaValidation = {
  create: [
    body('nombres')
      .notEmpty()
      .withMessage('Los nombres son requeridos')
      .isLength({ min: 2, max: 50 })
      .withMessage('Los nombres deben tener entre 2 y 50 caracteres'),
    
    body('apellidos')
      .notEmpty()
      .withMessage('Los apellidos son requeridos')
      .isLength({ min: 2, max: 50 })
      .withMessage('Los apellidos deben tener entre 2 y 50 caracteres'),
    
    body('fechanacimiento')
      .isISO8601()
      .withMessage('La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)'),
    
    body('tipodocumento')
      .isIn(['CUIT', 'CEDULA', 'DNI', 'LIBRETA_ENROLE', 'LIBRETA_CIVICA', 'PASAPORTE'])
      .withMessage('Tipo de documento inválido'),
    
    body('documento')
      .notEmpty()
      .withMessage('El documento es requerido')
      .isLength({ min: 7, max: 20 })
      .withMessage('El documento debe tener entre 7 y 20 caracteres'),
    
    body('correo')
      .isEmail()
      .withMessage('El correo electrónico debe ser válido')
      .normalizeEmail(),
    
    body('telefono')
      .notEmpty()
      .withMessage('El teléfono es requerido')
      .isMobilePhone('es-AR')
      .withMessage('El teléfono debe ser válido para Argentina'),
    
    body('localidad_id')
      .isInt({ min: 1 })
      .withMessage('El ID de localidad debe ser un número entero positivo')
  ]
};

export const vehiculoValidation = {
  create: [
    body('matricula')
      .notEmpty()
      .withMessage('La matrícula es requerida')
      .matches(/^[A-Z]{3}[0-9]{3}$|^[A-Z]{2}[0-9]{3}[A-Z]{2}$/)
      .withMessage('Formato de matrícula inválido'),
    
    body('añofabricación')
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage('El año de fabricación debe ser válido'),
    
    body('numeromotor')
      .notEmpty()
      .withMessage('El número de motor es requerido')
      .isLength({ max: 20 })
      .withMessage('El número de motor no puede exceder 20 caracteres'),
    
    body('chasis')
      .notEmpty()
      .withMessage('El número de chasis es requerido')
      .isLength({ max: 45 })
      .withMessage('El número de chasis no puede exceder 45 caracteres'),
    
    body('cliente_id')
      .isInt({ min: 1 })
      .withMessage('El ID de cliente debe ser un número entero positivo'),
    
    body('version_id')
      .isInt({ min: 1 })
      .withMessage('El ID de versión debe ser un número entero positivo')
  ]
};
