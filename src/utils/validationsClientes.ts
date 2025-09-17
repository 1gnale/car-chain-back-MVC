import { body, param, query } from "express-validator";

export const clientesValidation = {
  // Validación para crear cliente
  create: [
    // Validaciones para personaData
    body("personaData.nombres")
      .notEmpty()
      .withMessage("Los nombres son requeridos")
      .isLength({ min: 2, max: 50 })
      .withMessage("Los nombres deben tener entre 2 y 50 caracteres")
      .trim(),

    body("personaData.apellido")
      .notEmpty()
      .withMessage("El apellido es requerido")
      .isLength({ min: 2, max: 50 })
      .withMessage("El apellido debe tener entre 2 y 50 caracteres")
      .trim(),

    body("personaData.fechaNacimiento").custom((value) => {
      const fecha = new Date(value);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fecha.getFullYear();
      if (edad < 18 || edad > 100) {
        throw new Error("La edad debe estar entre 18 y 100 años");
      }
      return true;
    }),

    body("personaData.tipoDocumento")
      .isIn([
        "CUIT",
        "CEDULA",
        "DNI",
        "LIBRETA_ENROLE",
        "LIBRETA_CIVICA",
        "PASAPORTE",
      ])
      .withMessage("Tipo de documento inválido"),

    body("personaData.documento")
      .notEmpty()
      .withMessage("El documento es requerido")
      .isLength({ min: 2, max: 11 })
      .withMessage("El documento debe tener entre 2 y 11 caracteres")
      .trim(),

    body("personaData.domicilio")
      .notEmpty()
      .withMessage("El domicilio es requerido")
      .isLength({ min: 2, max: 100 })
      .withMessage("El domicilio debe tener entre 2 y 100 caracteres")
      .trim(),

    body("personaData.correo")
      .isEmail()
      .withMessage("El correo electrónico debe ser válido")
      .isLength({ max: 255 })
      .withMessage("El correo no puede exceder 255 caracteres")
      .normalizeEmail(),

    body("personaData.telefono")
      .notEmpty()
      .withMessage("El teléfono es requerido")
      .isLength({ min: 5, max: 20 })
      .withMessage("El teléfono debe tener entre 5 y 20 caracteres")
      .matches(/^[+\d\s\-()]+$/)
      .withMessage("El teléfono contiene caracteres inválidos"),

    body("personaData.sexo")
      .isIn(["Masculino", "Femenino"])
      .withMessage("El sexo debe ser Masculino o Femenino"),

    body("personaData.localidad_id")
      .isInt({ min: 1 })
      .withMessage("El ID de localidad debe ser un número entero positivo"),
  ],

  // Validación para obtener cliente por email
  getByEmail: [
    param("email")
      .isEmail()
      .withMessage("El email debe ser válido")
      .normalizeEmail(),
  ],

  // Validación para actualizar cliente
  update: [
    param("email")
      .isEmail()
      .withMessage("El email debe ser válido")
      .normalizeEmail(),

    // Validaciones opcionales para personaData (solo si se proporciona)
    body("personaData.nombres")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage("Los nombres deben tener entre 2 y 50 caracteres")
      .trim(),

    body("personaData.apellido")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage("El apellido debe tener entre 2 y 50 caracteres")
      .trim(),

    body("personaData.fechaNacimiento")
      .optional()
      .custom((value) => {
        if (value) {
          const fecha = new Date(value);
          const hoy = new Date();
          const edad = hoy.getFullYear() - fecha.getFullYear();
          if (edad < 18 || edad > 100) {
            throw new Error("La edad debe estar entre 18 y 100 años");
          }
        }
        return true;
      }),

    body("personaData.tipoDocumento")
      .optional()
      .isIn([
        "CUIT",
        "CEDULA",
        "DNI",
        "LIBRETA_ENROLE",
        "LIBRETA_CIVICA",
        "PASAPORTE",
      ])
      .withMessage("Tipo de documento inválido"),

    body("personaData.documento")
      .optional()
      .isLength({ min: 2, max: 11 })
      .withMessage("El documento debe tener entre 2 y 1 caracteres")
      .trim(),

    body("personaData.domicilio")
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage("El domicilio debe tener entre 2 y 100 caracteres")
      .trim(),

    body("personaData.correo")
      .optional()
      .isEmail()
      .withMessage("El correo electrónico debe ser válido")
      .isLength({ max: 255 })
      .withMessage("El correo no puede exceder 255 caracteres")
      .normalizeEmail(),

    body("personaData.telefono")
      .optional()
      .isLength({ min: 5, max: 20 })
      .withMessage("El teléfono debe tener entre 5 y 20 caracteres")
      .matches(/^[+\d\s\-()]+$/)
      .withMessage("El teléfono contiene caracteres inválidos"),

    body("personaData.sexo")
      .optional()
      .isIn(["Masculino", "Femenino"])
      .withMessage("El sexo debe ser Masculino o Femenino"),

    body("personaData.localidad_id")
      .optional()
      .isInt({ min: 1 })
      .withMessage("El ID de localidad debe ser un número entero positivo"),
  ],

  // Validación para consultas con paginación y filtros
  getAll: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("La página debe ser un número entero positivo"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("El límite debe ser un número entre 1 y 100"),

    query("search")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("El término de búsqueda debe tener entre 1 y 100 caracteres")
      .trim(),

    query("tipoDocumento")
      .optional()
      .isIn([
        "CUIT",
        "CEDULA",
        "DNI",
        "LIBRETA_ENROLE",
        "LIBRETA_CIVICA",
        "PASAPORTE",
      ])
      .withMessage("Tipo de documento inválido para filtro"),

    query("localidad_id")
      .optional()
      .isInt({ min: 1 })
      .withMessage("El ID de localidad debe ser un número entero positivo"),
  ],
};
