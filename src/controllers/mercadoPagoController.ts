import { Request, Response } from "express";
import { MercadoPagoConfig, Preference } from "mercadopago";
import {
  Cliente,
  Cotizacion,
  LineaCotizacion,
  Pago,
  PeriodoPago,
  Persona,
  Poliza,
  TipoContratacion,
  Vehiculo,
  Version,
} from "../models";
import { BaseService } from "../services/BaseService";
import { EstadoPoliza } from "../models/Poliza";
import { ethers } from "ethers";
import abi from "../ABI/abi.json"; // corregí si está en otro path

// Función auxiliar para desplegar póliza en blockchain
async function deployPolizaToBlockchain(
  numeroPoliza: number
): Promise<Poliza | null> {
  try {
    const QUICKNODE_AMOY_URL = process.env.QUICKNODE_AMOY_URL!;
    const PRIVATE_KEY_EMPRESA = process.env.PRIVATE_KEY!;
    const CONTRACT_ADDRESS = "0xaAe2E8b80E9eDFf62E8D1B7127249aBbed43daE0";

    const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_AMOY_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY_EMPRESA, provider);
    const contrato = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    // Obtener datos de la póliza con todas las relaciones necesarias
    const poliza = await Poliza.findByPk(numeroPoliza);
    if (!poliza) {
      throw new Error(`Póliza ${numeroPoliza} no encontrada para blockchain`);
    }

    // Obtener LineaCotizacion
    const lineaCotizacion = await LineaCotizacion.findByPk(
      poliza.lineaCotizacion_id
    );
    if (!lineaCotizacion) {
      throw new Error("LineaCotizacion no encontrada");
    }

    // Obtener Cotizacion
    const cotizacion = await Cotizacion.findByPk(lineaCotizacion.cotizacion_id);
    if (!cotizacion) {
      throw new Error("Cotizacion no encontrada");
    }

    // Obtener Vehiculo
    const vehiculo = await Vehiculo.findByPk(cotizacion.vehiculo_id);
    if (!vehiculo) {
      throw new Error("Vehiculo no encontrado");
    }

    // Obtener Cliente
    const cliente = await Cliente.findByPk(vehiculo.cliente_id);
    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }

    // Obtener Persona
    const persona = await Persona.findByPk(cliente.persona_id);
    if (!persona) {
      throw new Error("Persona no encontrada");
    }

    // Preparar datos para blockchain
    const nombre = `${persona.nombres} ${persona.apellido}`;
    const documento = persona.documento;
    const estado = poliza.estadoPoliza;
    const fechaVencimiento = poliza.fechaVencimiento?.toString();
    const numPoliza = poliza.numero_poliza.toString();
    const matriculaVehiculo = vehiculo.matricula;

    // 1. Crear hash de los datos
    const hash = ethers.utils.solidityKeccak256(
      ["string", "string", "string", "string", "string", "string"],
      [
        nombre,
        documento,
        numPoliza,
        estado,
        fechaVencimiento,
        matriculaVehiculo,
      ]
    );

    // 2. Firmar el hash
    const firmaPlano = wallet._signingKey().signDigest(hash);
    const firma = ethers.utils.joinSignature(firmaPlano);

    // 3. Ejecutar transacción
    const tx = await contrato.registrarPoliza(
      nombre,
      documento,
      numPoliza,
      estado,
      fechaVencimiento,
      matriculaVehiculo,
      hash,
      firma,
      {
        maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
        maxFeePerGas: ethers.utils.parseUnits("40", "gwei"),
        gasLimit: 500_000,
      }
    );

    await tx.wait();

    // Actualizar hash en base de datos
    const updatedPoliza: Poliza = await poliza.update({
      hashContrato: tx.hash,
    });

    return updatedPoliza;
  } catch (error) {
    console.error("Error en deployPolizaToBlockchain:", error);
    return null;
  }
}

// Endpoint
export class MercadoPagoController {
  // HU 20.1 - El backend debe ser capaz de realizar el pago de la poliza via mercadopago, registrando la poliza con estado pendiente hasta que este se concrete.
  static async crearPrimerMercadoPagoPreference(req: Request, res: Response) {
    try {
      const isProduction = process.env.NODE_ENV === "production";

      const {
        poliza_numero,
        total,
        descripcion,
        payer_email,
        payer_name,
        payer_surname,
        payer_phone,
        payer_identification,
        back_urls,
        external_reference,
        idTipoContratacion,
        idPeriodoPago,
      } = req.body;

      const poliza = await Poliza.findByPk(poliza_numero);

      if (!poliza) {
        return BaseService.serverError(res, "Poliza no encontrada");
      }
      if (poliza.estadoPoliza != EstadoPoliza.APROBADA) {
        return BaseService.serverError(
          res,
          "El primer pago solo puede realizarse en una poliza Aprobada"
        );
      }

      // Crear registro de pago pendiente en la base de datos
      const nuevoPago = await Pago.create({
        total: parseFloat(total),
        fecha: new Date(),
        hora: new Date().toTimeString().split(" ")[0],
        poliza_numero: poliza_numero,
        mp_preference_id: "-",
        mp_status: "Pendiente",
      });

      const mercadopago = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
      });

      const preference = await new Preference(mercadopago).create({
        body: {
          items: [
            {
              id: `poliza_${poliza_numero}`,
              title: descripcion || `Pago de póliza #${poliza_numero}`,
              quantity: 1,
              unit_price: parseFloat(total),
              description: `Pago correspondiente a la póliza de seguro número ${poliza_numero}`,
            },
          ],
          payer: {
            email: payer_email,
            ...(payer_name && { name: payer_name }),
            ...(payer_surname && { surname: payer_surname }),
            ...(payer_phone && {
              phone: {
                area_code: payer_phone.area_code,
                number: payer_phone.number,
              },
            }),
            ...(payer_identification && {
              identification: {
                type: payer_identification.type,
                number: payer_identification.number,
              },
            }),
          },
          back_urls: {
            success: `${process.env.CORS_ORIGIN}/procesando-primerPago/${poliza_numero}/${nuevoPago.id}/${idTipoContratacion}/${idPeriodoPago}`,
            pending: `${process.env.CORS_ORIGIN}`,
            failure: `${process.env.CORS_ORIGIN}/pago-fallido/${nuevoPago.id}`,
          },

          // External reference que incluye información para el webhook
          external_reference:
            external_reference ||
            `poliza_${poliza_numero}_tipo_${idTipoContratacion}_periodo_${idPeriodoPago}_pago_${nuevoPago.id}`,
          expires: true,
          expiration_date_to: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString(), // 24 horas
        },
      });
      if (isProduction) {
        preference.auto_return = "approved";
      }

      await nuevoPago.update({
        mp_preference_id: preference.id,
        mp_external_reference: preference.external_reference,
      });

      res.json({ init_point: preference.init_point });
    } catch (error) {
      console.error("Error al crear preferencia:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  // HU20.1 - El backend debe ser capaz de guardar los datos importantes de la poliza en la blockchain una vez el pago haya sido confirmado.
  static async deployPoliza(req: Request, res: Response) {
    try {
      const QUICKNODE_AMOY_URL = process.env.QUICKNODE_AMOY_URL!;
      const PRIVATE_KEY_EMPRESA = process.env.PRIVATE_KEY!;
      const CONTRACT_ADDRESS = "0xaAe2E8b80E9eDFf62E8D1B7127249aBbed43daE0";

      const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_AMOY_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY_EMPRESA, provider);
      const contrato = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

      // 1. Crear hash de los datos
      const { numero_poliza } = req.params;

      const resPoliza = await Poliza.findByPk(numero_poliza);

      if (!resPoliza) {
        return BaseService.notFound(res, "Poliza no encontrada");
      }

      const lineaCotizacion = await LineaCotizacion.findByPk(
        resPoliza.lineaCotizacion_id
      );
      if (!lineaCotizacion) {
        return BaseService.notFound(res, "lineaCotizacion no encontrada");
      }
      const cotizacion = await Cotizacion.findByPk(
        lineaCotizacion.cotizacion_id
      );
      if (!cotizacion) {
        return BaseService.notFound(res, "cotizacion no encontrada");
      }
      const vehiculo = await Vehiculo.findByPk(cotizacion.vehiculo_id);
      if (!vehiculo) {
        return BaseService.notFound(res, "cotizacion no encontrada");
      }
      const cliente = await Cliente.findByPk(vehiculo.cliente_id);
      if (!cliente) {
        return BaseService.notFound(res, "cliente no encontrada");
      }
      const persona = await Persona.findByPk(cliente.persona_id);
      if (!persona) {
        return BaseService.notFound(res, "persona no encontrada");
      }

      const nombre = persona.nombres;
      const documento = persona.documento;
      const estado = resPoliza.estadoPoliza;
      const fechaVencimiento = resPoliza.fechaVencimiento;
      const matriculaVehiculo = vehiculo.matricula;

      const hash = ethers.utils.solidityKeccak256(
        ["string", "string", "string", "string", "string", "string"],
        [
          nombre,
          documento,
          numero_poliza,
          estado,
          fechaVencimiento,
          matriculaVehiculo,
        ]
      );

      // 2. Firmar el hash con la private key de la empresa
      const firmaPlano = wallet._signingKey().signDigest(hash);
      const firma = ethers.utils.joinSignature(firmaPlano); // firma como `bytes` para Solidity

      // 3. Llamar al contrato
      const tx = await contrato.registrarPoliza(
        nombre,
        documento,
        numero_poliza,
        estado,
        fechaVencimiento,
        matriculaVehiculo,
        hash,
        firma,
        {
          maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"),
          maxFeePerGas: ethers.utils.parseUnits("40", "gwei"),
          gasLimit: 500_000,
        }
      );

      await tx.wait(); // Esperar a que se confirme

      console.log("Póliza registrada en blockchain:", tx.hash);

      await Poliza.update(
        {
          hashContrato: String(tx.hash),
        },
        { where: { numero_poliza: numero_poliza } }
      );

      return BaseService.success(res, tx.hash, "Poliza desplegada: " + tx.hash);
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error deployar poliza en blockchain"
      );
    }
  }

  // HU20.1 - El backend debe ser capaz de actualizar los datos de la póliza (Estado aprobado, tipo de contratación, periodo de pago y fecha de pago)
  // y el pago (estado vigente) cuando el pago haya sido confirmado.
  static async updateFirstPolizaYPagoState(req: Request, res: Response) {
    try {
      const { numero_poliza, pagoId, idTipoContratacion, idPeriodoPago } =
        req.params;

      // Verificar que la póliza existe
      const poliza = await Poliza.findByPk(Number(numero_poliza));
      if (!poliza) {
        console.error(`❌ Póliza ${numero_poliza} no encontrada`);
        return BaseService.serverError(
          res,
          new Error("Póliza no encontrada"),
          "No se encontró la póliza especificada"
        );
      }

      // Verificar que el pago existe
      const pago = await Pago.findByPk(Number(pagoId));
      if (!pago) {
        console.error(`❌ Pago ${pagoId} no encontrado`);
        return BaseService.serverError(
          res,
          new Error("Pago no encontrado"),
          "No se encontró el pago especificado"
        );
      }

      // Verificar configuraciones
      const tipoContratacion = await TipoContratacion.findByPk(
        Number(idTipoContratacion)
      );
      if (!tipoContratacion) {
        console.error(` TipoContratacion ${idTipoContratacion} no encontrado`);
        return BaseService.serverError(
          res,
          new Error("Tipo de contratación no encontrado"),
          "No se encontró el tipo de contratación especificado"
        );
      }

      const periodoPago = await PeriodoPago.findByPk(Number(idPeriodoPago));
      if (!periodoPago) {
        console.error(` PeriodoPago ${idPeriodoPago} no encontrado`);
        return BaseService.serverError(
          res,
          new Error("Periodo de pago no encontrado"),
          "No se encontró el periodo de pago especificado"
        );
      }

      // Actualizar la póliza
      await poliza.update({
        tipoContratacion_id: Number(idTipoContratacion),
        periodoPago_id: Number(idPeriodoPago),
        precioPolizaActual: pago.total,
        fechaContratacion: new Date(),
        fechaDePago: sumarMeses(periodoPago.cantidadMeses),
        fechaVencimiento: sumarMeses(tipoContratacion.cantidadMeses),
        estadoPoliza: EstadoPoliza.VIGENTE,
      });

      // Actualizar el pago
      await pago.update({
        mp_status: "APROBADO",
      });

      console.log(
        `✅ Primer pago procesado exitosamente - Póliza: ${numero_poliza}, Pago: ${pagoId}`
      );

      // Desplegar póliza en blockchain
      console.log(
        `📄 Iniciando despliegue en blockchain para póliza ${numero_poliza}`
      );
      const deployedPoliza = await deployPolizaToBlockchain(
        Number(numero_poliza)
      );

      if (deployedPoliza) {
        console.log(
          `✅ Póliza ${numero_poliza} desplegada en blockchain: ${JSON.stringify(
            deployedPoliza
          )}`
        );
      } else {
        console.error(
          `❌ Error al desplegar póliza ${numero_poliza} en blockchain`
        );
        throw Error("Error al desplegar póliza en blockchain");
      }

      return BaseService.success(
        res,
        deployedPoliza,
        "Datos actualizados exitosamente y poliza desplegada"
      );
    } catch (error: any) {
      console.error(`❌ Error en updateFirstPolizaYPagoState:`, error);
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar los datos del primer pago"
      );
    }
  }

  static async getExistencia(req: Request, res: Response) {
    try {
      const { numeroPoliza } = req.params;

      const QUICKNODE_AMOY_URL = process.env.QUICKNODE_AMOY_URL!;
      const PRIVATE_KEY_EMPRESA = process.env.PRIVATE_KEY!;
      const CONTRACT_ADDRESS = "0xaAe2E8b80E9eDFf62E8D1B7127249aBbed43daE0";

      const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_AMOY_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY_EMPRESA, provider);
      const contrato = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

      const existe = await contrato.validarExistencia(numeroPoliza);
      if (!existe) {
        return false;
      }

      return existe;
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al verificar existencia"
      );
    }
  }

  static async getPolizaBlockChain(req: Request, res: Response) {
    try {
      const QUICKNODE_AMOY_URL = process.env.QUICKNODE_AMOY_URL!;
      const PRIVATE_KEY_EMPRESA = process.env.PRIVATE_KEY!;
      const CONTRACT_ADDRESS = "0xaAe2E8b80E9eDFf62E8D1B7127249aBbed43daE0";

      const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_AMOY_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY_EMPRESA, provider);
      const contrato = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

      const { numeroPoliza } = req.params;

      if (!numeroPoliza) {
        return BaseService.serverError(
          res,
          null,
          "Numero de poliza debe ser mayor a 0"
        );
      }

      // 👇 acá estaba el error: faltaban los paréntesis de toString()
      const poliza = await contrato.obtenerPoliza(numeroPoliza.toString());

      // Validación: si la póliza no existe
      if (!poliza || poliza.numeroPoliza === "") {
        return res.status(404).json({
          message: "Poliza no encontrada en blockchain",
        });
      }

      const polizaDB = await Poliza.findByPk(numeroPoliza);
      if (!polizaDB) {
        return res.status(404).json({
          message: "Poliza no encontrada en base de datos",
        });
      }

      // Devolver respuesta JSON
      return res.json({
        nombre: poliza.nombre,
        documento: poliza.documento,
        numeroPoliza: poliza.numeroPoliza,
        estado: poliza.estado,
        fechaVencimiento: poliza.fechaVencimiento,
        matriculaVehiculo: poliza.matriculaVehiculo,
        hashDatos: poliza.hashDatos,
        hashTransaccion: polizaDB.hashContrato,
        firma: poliza.firma,
      });
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al obtener poliza de blockchain"
      );
    }
  }

  // HU20.2 - El backend debe ser capaz de realizar el pago de la poliza via mercadopago, registrando la poliza con estado pendiente hasta que este se concrete.
  static async crearMercadoPagoPreference(req: Request, res: Response) {
    try {
      const isProduction = process.env.NODE_ENV === "production";

      const {
        poliza_numero,
        total,
        descripcion,
        payer_email,
        payer_name,
        payer_surname,
        payer_phone,
        payer_identification,
        back_urls,
        external_reference,
        idTipoContratacion,
        idPeriodoPago,
      } = req.body;

      const poliza = await Poliza.findByPk(poliza_numero);

      if (!poliza) {
        return BaseService.serverError(res, "Poliza no encontrada");
      }

      if (poliza.estadoPoliza != EstadoPoliza.IMPAGA) {
        return BaseService.notFound(
          res,
          "El primer pago solo puede realizarse en una poliza impaga"
        );
      }

      // Crear registro de pago pendiente en la base de datos
      const nuevoPago = await Pago.create({
        total: parseFloat(total),
        fecha: new Date(),
        hora: new Date().toTimeString().split(" ")[0],
        poliza_numero: poliza_numero,
        mp_preference_id: "-",
        mp_status: "Pendiente",
      });

      const mercadopago = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN!,
      });

      const preference = await new Preference(mercadopago).create({
        body: {
          items: [
            {
              id: `poliza_${poliza_numero}`,
              title: descripcion || `Pago de póliza #${poliza_numero}`,
              quantity: 1,
              unit_price: parseFloat(total),
              description: `Pago correspondiente a la póliza de seguro número ${poliza_numero}`,
            },
          ],
          payer: {
            email: payer_email,
            ...(payer_name && { name: payer_name }),
            ...(payer_surname && { surname: payer_surname }),
            ...(payer_phone && {
              phone: {
                area_code: payer_phone.area_code,
                number: payer_phone.number,
              },
            }),
            ...(payer_identification && {
              identification: {
                type: payer_identification.type,
                number: payer_identification.number,
              },
            }),
          },

          back_urls: {
            success: `${process.env.CORS_ORIGIN}/procesando-pago/${poliza_numero}/${nuevoPago.id}`,
            pending: `${process.env.CORS_ORIGIN}`,
            failure: `${process.env.CORS_ORIGIN}/pago-fallido/${nuevoPago.id}`,
          },

          // External reference que incluye información para el webhook
          external_reference:
            external_reference ||
            `poliza_${poliza_numero}_tipo_${idTipoContratacion}_periodo_${idPeriodoPago}_pago_${nuevoPago.id}`,
          expires: true,
          expiration_date_to: new Date(
            Date.now() + 24 * 60 * 60 * 1000
          ).toISOString(), // 24 horas
        },
      });
      if (isProduction) {
        preference.auto_return = "approved";
      }

      await nuevoPago.update({
        mp_preference_id: preference.id,
        mp_external_reference: preference.external_reference,
      });

      res.json({ init_point: preference.init_point });
    } catch (error) {
      console.error("Error al crear preferencia:", error);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  // HU20.2 - El backed debe ser capaz de actualizar los datos del pago (estado vigente) cuando el pago haya sido confirmado.
  static async updatePolizaYPagoState(req: Request, res: Response) {
    try {
      const { numero_poliza, pagoId } = req.params;

      const poliza = await Poliza.findByPk(numero_poliza);

      if (!poliza) {
        return BaseService.notFound(res, "poliza no encontrada");
      }

      const pago = await Pago.findByPk(pagoId);

      if (!pago) {
        return BaseService.serverError(res, "pago no encontrado");
      }

      const periodoPago = await PeriodoPago.findByPk(poliza.periodoPago_id);
      if (!periodoPago) {
        return BaseService.notFound(res, "periodoPago no encontrado");
      }

      const polizaModificada = await poliza.update({
        estadoPoliza: EstadoPoliza.VIGENTE,
        fechaDePago: sumarMeses(periodoPago.cantidadMeses),
      });

      const pagoModificada = await pago.update({
        mp_status: "Aprobado",
      });

      return BaseService.success(
        res,
        polizaModificada,
        "Datos actualizados y pago efectuado"
      );
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar los datos"
      );
    }
  }

  // HU20.2 - El backend debe ser capaz de cambiar los datos de la póliza en la blockchain.
  static async cambiarEstadoPolizaBlockChain(req: Request, res: Response) {
    try {
      const QUICKNODE_AMOY_URL = process.env.QUICKNODE_AMOY_URL!;
      const PRIVATE_KEY_EMPRESA = process.env.PRIVATE_KEY!;
      const CONTRACT_ADDRESS = "0xaAe2E8b80E9eDFf62E8D1B7127249aBbed43daE0";

      const provider = new ethers.providers.JsonRpcProvider(QUICKNODE_AMOY_URL);
      const wallet = new ethers.Wallet(PRIVATE_KEY_EMPRESA, provider);
      const contrato = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

      const { numeroPoliza, nuevoEstado } = req.params;

      // 1. Crear hash de los datos
      const hash = ethers.utils.solidityKeccak256(
        ["string", "string"],
        [numeroPoliza, nuevoEstado]
      );

      // 2. Firmar el hash con la private key de la empresa
      const firmaPlano = wallet._signingKey().signDigest(hash);
      const firma = ethers.utils.joinSignature(firmaPlano); // firma como `bytes` para Solidity

      // 3. Llamar al contrato
      const tx = await contrato.cambiarEstado(numeroPoliza, nuevoEstado, {
        maxPriorityFeePerGas: ethers.utils.parseUnits("25", "gwei"), //  mínimo exigido
        maxFeePerGas: ethers.utils.parseUnits("40", "gwei"), //  un poco más alto por seguridad
        gasLimit: 500_000,
      });

      await Poliza.update(
        {
          hashContrato: tx.hash,
        },
        { where: { numero_poliza: numeroPoliza } }
      );

      return tx.hash;
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al cambiar estado en blockchain"
      );
    }
  }

  // HU20.2 - El backed debe ser capaz de actualizar los datos del pago (estado vigente) cuando el pago haya sido confirmado.
  static async updatePagoFallido(req: Request, res: Response) {
    try {
      const { pagoId } = req.params;

      const pago = await Pago.findByPk(pagoId);

      if (!pago) {
        return BaseService.serverError(res, "pago no encontrado");
      }

      const pagoModificada = await pago.destroy();

      return BaseService.success(res, "Pago eliminado existosamente");
    } catch (error: any) {
      return BaseService.serverError(
        res,
        error,
        "Error al actualizar los datos"
      );
    }
  }
}

function sumarMeses(meses: number): Date {
  const hoy = new Date();
  const nuevaFecha = new Date(hoy);
  nuevaFecha.setMonth(hoy.getMonth() + meses);
  return nuevaFecha;
}
