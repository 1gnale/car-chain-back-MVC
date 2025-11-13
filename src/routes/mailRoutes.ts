import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/enviar-email", async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }
  console.log(email);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // o "hotmail", "outlook", etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Centro de Ayuda CAR-CHAIN" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_DESTINO, // a dónde llega el mail
      subject: "Nuevo de ayuda",
      text: `
        Nombre: ${nombre}
        Email: ${email}
        Mensaje: ${mensaje}
      `,
    });

    res.json({ ok: true, mensaje: "Correo enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al enviar correo" });
  }
});

export default router;
