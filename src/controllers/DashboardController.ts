import { Request, Response } from "express";
import Usuario from "../models/Usuario";
import Cliente from "../models/Cliente";
import Marca from "../models/Marca";
import Poliza from "../models/Poliza";
import Cobertura from "../models/Cobertura";
import { BaseService } from "../services/BaseService";
// db/connection.ts
import { Sequelize, STRING } from "sequelize";
import { ethers } from "ethers";
import abi from "../ABI/abi.json"; // corregí si está en otro path

class DashboardController {
  static async getCounts(req: Request, res: Response) {
    try {
      const usuariosActivos = await Usuario.count({ where: { activo: true } });
      const clientesRegistrados = await Cliente.count();
      const marcasRegistradas = await Marca.count();
      const polizasVigentes = await Poliza.count({
        where: { estadoPoliza: "VIGENTE" },
      });
      const coberturasActivas = await Cobertura.count({
        where: { activo: true },
      });

      return BaseService.created(
        res,
        {
          usuariosActivos: usuariosActivos,
          clientesRegistrados: clientesRegistrados,
          marcasRegistradas: marcasRegistradas,
          polizasVigentes: polizasVigentes,
          coberturasActivas: coberturasActivas,
        },
        "Datos Dashboar"
      );
    } catch (error) {
      return BaseService.serverError(res, error, "Error al contar datos");
    }
  }

  static async status(req: Request, res: Response) {
    const status = { BaseDatos: "", Blockchain: "", Billetera: "" };

    // 1. Chequeo Base de Datos
    try {
      const start = Date.now();

      const db = new Sequelize(
        String(process.env.DB_NAME), // nombre de la base
        String(process.env.DB_USER), // usuario
        String(process.env.DB_PASSWORD), // password
        {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT), // 👈 el puerto que te dio Aiven (fíjate en el dashboard)
          dialect: "mysql", // 👈 especificar siempre el dialecto
          logging: false, // opcional: silencia logs
        }
      );

      try {
        await db.authenticate(); // mejor que query("SELECT 1")
        console.log("Base de datos OK");
        status.BaseDatos = "Operativo";
      } catch (error) {
        console.error("Error en la base:", error);
        status.BaseDatos = "Caído";
      }
    } catch (e) {
      status.BaseDatos = "Caído";
    }

    // 2. Chequeo Nodo Blockchain

    const QUICKNODE_AMOY_URL = process.env.QUICKNODE_AMOY_URL!;
    const PRIVATE_KEY_EMPRESA = process.env.PRIVATE_KEY!;
    const CONTRACT_ADDRESS = "0xaAe2E8b80E9eDFf62E8D1B7127249aBbed43daE0";

    const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_AMOY_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY_EMPRESA, provider);
    const contrato = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    try {
      const responseBlock = await provider.getBlockNumber();
      status.Blockchain = "Operativo";
    } catch {
      status.Blockchain = "Caído";
    }

    // 3. Chequeo Billetera Electrónica
    try {
      const responseAddres = await wallet.getBalance();
      status.Billetera = "Operativo";
    } catch {
      status.Billetera = "Caída";
    }

    return BaseService.created(res, status, "Estatus Dashboar");
  }
}

export default DashboardController;
