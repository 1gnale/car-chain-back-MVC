import { body, param, query } from "express-validator";
import { Persona, Usuario } from "../models";

export const usuariosValidation = {
  // Validación para crear usuario
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
      .isLength({ min: 7, max: 20 })
      .withMessage("El documento debe tener entre 7 y 20 caracteres")
      .trim(),

    body("personaData.domicilio")
      .notEmpty()
      .withMessage("El domicilio es requerido")
      .isLength({ min: 5, max: 100 })
      .withMessage("El domicilio debe tener entre 5 y 100 caracteres")
      .trim(),

    body("personaData.correo")
      .isEmail()
      .withMessage("El correo electrónico debe ser válido")
      .isLength({ max: 255 })
      .withMessage("El correo no puede exceder 255 caracteres")
      .normalizeEmail()
      .custom(async (value) => {
        // 1️⃣ Buscar si existe una persona con ese correo
        const persona = await Persona.findOne({ where: { correo: value } });

        if (persona) {
          // 2️⃣ Verificar si esa persona tiene un usuario asociado
          const usuarioExistente = await Usuario.findOne({
            where: { persona_id: persona.id },
          });

          // 3️⃣ Si tiene usuario y está activo, lanzar error
          if (usuarioExistente && usuarioExistente.activo === true) {
            throw new Error(
              "El correo ya está asociado a una persona con un usuario activo"
            );
          }
        }

        // ✅ Si no existe persona, o si tiene usuario inactivo, pasa la validación
        return true;
      }),

    body("personaData.telefono")
      .notEmpty()
      .withMessage("El teléfono es requerido")
      .isLength({ min: 8, max: 20 })
      .withMessage("El teléfono debe tener entre 8 y 20 caracteres")
      .matches(/^[+\d\s\-()]+$/)
      .withMessage("El teléfono contiene caracteres inválidos"),

    body("personaData.sexo")
      .isIn(["Masculino", "Femenino"])
      .withMessage("El sexo debe ser Masculino o Femenino"),

    body("personaData.localidad_id")
      .isInt({ min: 1 })
      .withMessage("El ID de localidad debe ser un número entero positivo"),

    // Validaciones para datos del usuario
    body("tipoUsuario")
      .isIn(["ADMINISTRADOR", "VENDEDOR", "PERITO", "GESTOR_DE_SINIESTROS"])
      .withMessage(
        "Tipo de usuario inválido. Debe ser: ADMINISTRADOR, VENDEDOR, PERITO o GESTOR_DE_SINIESTROS"
      ),
  ],

  // Validación para actualizar estado del usuario
  updateState: [
    param("legajo")
      .isInt({ min: 1 })
      .withMessage("El legajo debe ser un número entero positivo"),

    body("activo")
      .isBoolean()
      .withMessage("El estado debe ser verdadero o falso")
      .toBoolean(),
  ],

  // Validación para obtener usuario por ID
  getById: [
    param("legajo")
      .isInt({ min: 1 })
      .withMessage("El legajo debe ser un número entero positivo"),
  ],
  // Validación para obtener usuario por mail
  getByMail: [param("mail").notEmpty().withMessage("El mail es obligatorio")],
  // Validación para actualizar usuario completo
  update: [
    param("legajo")
      .isInt({ min: 1 })
      .withMessage("El legajo debe ser un número entero positivo"),

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
      .isLength({ min: 7, max: 20 })
      .withMessage("El documento debe tener entre 7 y 20 caracteres")
      .trim(),

    body("personaData.domicilio")
      .optional()
      .isLength({ min: 5, max: 100 })
      .withMessage("El domicilio debe tener entre 5 y 100 caracteres")
      .trim(),

    body("personaData.correo")
      .optional()
      .isEmail()
      .withMessage("El correo electrónico debe ser válido")
      .isLength({ max: 255 })
      .withMessage("El correo no puede exceder 255 caracteres")
      .normalizeEmail()
      .custom(async (value) => {
        // 1️⃣ Buscar si existe una persona con ese correo
        const persona = await Persona.findOne({ where: { correo: value } });

        if (persona) {
          // 2️⃣ Verificar si esa persona tiene un usuario asociado
          const usuarioExistente = await Usuario.findOne({
            where: { persona_id: persona.id },
          });

          // 3️⃣ Si tiene usuario y está activo, lanzar error
          if (
            usuarioExistente &&
            usuarioExistente.activo === true &&
            persona.correo !== value
          ) {
            throw new Error(
              "El correo ya está asociado a una persona con un usuario activo"
            );
          }
        }

        // ✅ Si no existe persona, o si tiene usuario inactivo, pasa la validación
        return true;
      }),

    body("personaData.telefono")
      .optional()
      .isLength({ min: 8, max: 20 })
      .withMessage("El teléfono debe tener entre 8 y 20 caracteres")
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

    // Validaciones opcionales para datos del usuario
    body("tipoUsuario")
      .optional()
      .isIn(["ADMINISTRADOR", "VENDEDOR", "PERITO", "GESTOR_DE_SINIESTROS"])
      .withMessage(
        "Tipo de usuario inválido. Debe ser: ADMINISTRADOR, VENDEDOR, PERITO o GESTOR_DE_SINIESTROS"
      ),

    body("activo")
      .optional()
      .isBoolean()
      .withMessage("El estado activo debe ser verdadero o falso")
      .toBoolean(),
  ],

  // Validación para consultas con paginación (si fuera necesario)
  getAll: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("La página debe ser un número entero positivo"),

    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("El límite debe ser un número entre 1 y 100"),

    query("tipoUsuario")
      .optional()
      .isIn(["ADMINISTRADOR", "VENDEDOR", "PERITO", "GESTOR_DE_SINIESTROS"])
      .withMessage("Tipo de usuario inválido para filtro"),

    query("activo")
      .optional()
      .isBoolean()
      .withMessage("El filtro activo debe ser verdadero o falso")
      .toBoolean(),
  ],
};
