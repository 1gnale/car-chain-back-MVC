import { Request, Response } from "express";
import { Usuario, Persona, Localidad, Provincia } from "../models";
import { BaseService } from "../services/BaseService";
import { Op, where } from "sequelize";

const createPersona = async (personaData: any) => {
  return await Persona.create(personaData);
};

export class UsuariosController {
  static async getAllUsuarios(req: Request, res: Response) {
    try {
      const { page, limit, tipoUsuario, activo } = req.query;

      // Configurar paginación si se proporciona
      const pagination: any = {};
      if (page && limit) {
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        pagination.limit = limitNum;
        pagination.offset = (pageNum - 1) * limitNum;
      }

      // Configurar filtros
      const whereClause: any = {};
      if (tipoUsuario) {
        whereClause.tipoUsuario = tipoUsuario;
      }
      if (activo !== undefined) {
        whereClause.activo = activo === "true";
      }

      const usuarios = await Usuario.findAll({
        where: whereClause,
        include: [{ model: Persona, as: "persona" }],
        order: [["legajo", "ASC"]],
        ...pagination,
      });

      return BaseService.success(
        res,
        usuarios,
        "Usuarios obtenidos exitosamente",
        usuarios.length
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener los usuarios"
      );
    }
  }

  static async createUsuario(req: Request, res: Response) {
    try {
      const { personaData, tipoUsuario } = req.body;

      // Verificar si ya existe una persona con el mismo documento o correo
      const existingPersona = await Persona.findOne({
        where: {
          [Op.or]: [
            { documento: personaData.documento },
            { correo: personaData.correo },
          ],
        },
      });

      if (existingPersona) {
        return BaseService.validationError(res, {
          array: () => [
            {
              msg: "Ya existe una persona con el mismo documento o correo electrónico",
              path: "personaData",
            },
          ],
        } as any);
      }

      const persona: Persona = await createPersona(personaData);
      const nuevoUsuario = await Usuario.create({
        persona_id: persona.id,
        activo: true,
        tipoUsuario,
      });

      // Obtener el usuario completo con la información de la persona
      const usuarioCompleto = await Usuario.findByPk(nuevoUsuario.legajo, {
        include: [{ model: Persona, as: "persona" }],
      });

      return BaseService.created(
        res,
        usuarioCompleto,
        "Usuario creado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al crear el usuario");
    }
  }

  static async updateUsuarioState(req: Request, res: Response) {
    try {
      const { legajo } = req.params;
      const { state } = req.body;
      const usuario = await Usuario.findByPk(legajo);
      if (!usuario) {
        return BaseService.notFound(res, "Usuario no encontrado");
      }
      usuario.activo = state;
      await usuario.save();
      return BaseService.success(
        res,
        usuario,
        "Estado del usuario actualizado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar el estado del usuario"
      );
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { legajo } = req.params;
      const usuario = await Usuario.findByPk(legajo, {
        include: [{ model: Persona, as: "persona" }],
      });
      if (!usuario) {
        return BaseService.notFound(res, "Usuario no encontrado");
      }
      return BaseService.success(res, usuario, "Usuario obtenido exitosamente");
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener el usuario");
    }
  }

  static async getUserByMail(req: Request, res: Response) {
    try {
      const { mail } = req.params;
      const usuario = await Usuario.findOne({
        include: [{ model: Persona, as: "persona", where: { correo: mail } }],
      });

      if (!usuario) {
        return BaseService.notFound(res, "Usuario no encontrado");
      }
      const persona = await Persona.findByPk(usuario.persona_id);
      if (!persona) {
        return BaseService.notFound(res, "persona no encontrado");
      }
      const localidad = await Localidad.findByPk(persona.localidad_id);
      if (!localidad) {
        return BaseService.notFound(res, "localidad no encontrado");
      }
      const provincia = await Provincia.findByPk(localidad.provincia_id);
      if (!provincia) {
        return BaseService.notFound(res, "provincia no encontrado");
      }
      const finalUser = {
        legajo: usuario.legajo,
        activo: usuario.activo,
        tipoUsuario: usuario.tipoUsuario,
        persona: {
          id: usuario.persona_id,
          nombres: persona.nombres,
          apellido: persona.apellido,
          fechaNacimiento: persona.fechaNacimiento,
          tipoDocumento: persona.tipoDocumento,
          documento: persona.documento,
          domicilio: persona.domicilio,
          correo: persona.correo,
          telefono: persona.telefono,
          sexo: persona.sexo,
          localidad: {
            id: localidad.id,
            descripcion: localidad.descripcion,
            codigoPostal: localidad.codigoPostal,
            activo: localidad.activo,
            provincia: {
              id: provincia.id,
              descripcion: provincia.descripcion,
              activo: provincia.activo,
            },
          },
        },
      };
      return BaseService.success(
        res,
        finalUser,
        "Usuario obtenido exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al obtener el usuario");
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { legajo } = req.params;
      const { personaData, tipoUsuario, activo } = req.body;

      const usuario = await Usuario.findByPk(legajo, {
        include: [{ model: Persona, as: "persona" }],
      });

      if (!usuario) {
        return BaseService.notFound(res, "Usuario no encontrado");
      }

      // Si se proporcionan datos de persona, verificar duplicados
      if (personaData && (personaData.documento || personaData.correo)) {
        const whereConditions = [];
        if (personaData.documento) {
          whereConditions.push({ documento: personaData.documento });
        }
        if (personaData.correo) {
          whereConditions.push({ correo: personaData.correo });
        }

        const existingPersona = await Persona.findOne({
          where: {
            [Op.or]: whereConditions,
            id: { [Op.ne]: usuario.persona_id }, // Excluir la persona actual
          },
        });

        if (existingPersona) {
          return BaseService.validationError(res, {
            array: () => [
              {
                msg: "Ya existe otra persona con el mismo documento o correo electrónico",
                path: "personaData",
              },
            ],
          } as any);
        }
      }

      // Actualizar datos de la persona si se proporcionan
      if (personaData) {
        const persona = await Persona.findByPk(usuario.persona_id);
        if (persona) {
          await persona.update(personaData);
        }
      }

      // Actualizar datos del usuario
      if (tipoUsuario !== undefined) usuario.tipoUsuario = tipoUsuario;
      if (activo !== undefined) usuario.activo = activo;
      await usuario.save();

      // Obtener el usuario actualizado con la información de la persona
      const usuarioActualizado = await Usuario.findByPk(legajo, {
        include: [{ model: Persona, as: "persona" }],
      });

      return BaseService.success(
        res,
        usuarioActualizado,
        "Usuario actualizado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar el usuario"
      );
    }
  }
}
