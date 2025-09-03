import { Request, Response } from "express";
import axios from "axios";
import { BaseService } from "../services/BaseService";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN as string; // ej: "miapp.us.auth0.com"
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID as string;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET as string;
const AUTH0_CONNECTION = "Username-Password-Authentication";

export class Auth0UserController {
  // Función interna para obtener token de Management API
  private static async getManagementToken(): Promise<string> {
    const res = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type: "client_credentials",
    });
    return res.data.access_token;
  }

  static async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const token = await this.getManagementToken();

      const response = await axios.get(
        `https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.length === 0) {
        return BaseService.notFound(res, "Usuario no encontrado");
      }

      return BaseService.success(
        res,
        response.data[0],
        "Usuario obtenido exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al buscar el usuario");
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return BaseService.validationError(res, {
          array: () => [
            { msg: "El email es requerido", path: "email" },
            { msg: "La contraseña es requerida", path: "password" },
          ],
        } as any);
      }

      const token = await this.getManagementToken();

      // Verificar si el usuario ya existe
      const existing = await axios.get(
        `https://${AUTH0_DOMAIN}/api/v2/users-by-email?email=${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (existing.data.length > 0) {
        return BaseService.conflict(
          res,
          "El usuario ya existe",
          existing.data[0]
        );
      }

      // Crear usuario
      const newUser = await axios.post(
        `https://${AUTH0_DOMAIN}/api/v2/users`,
        {
          connection: AUTH0_CONNECTION,
          email,
          password,
          email_verified: false,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return BaseService.created(
        res,
        newUser.data,
        "Usuario creado exitosamente"
      );
    } catch (error: any) {
      return BaseService.serverError(res, error, "Error al crear el usuario");
    }
  }
}
