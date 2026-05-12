const nodemailer = require('nodemailer');

async function criarTransportador() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

async function sendConfirmationEmail({ nome, email }) {
  const transporter = await criarTransportador();

  const fromAddress = process.env.EMAIL_FROM || 'Connexa <no-reply@connexa.edu.br>';
  const subject = 'Confirmação de cadastro Connexa';
  const text = `Olá ${nome},\n\nSeu cadastro na plataforma Connexa foi realizado com sucesso.\n\nObrigado!`;
  const html = `
    <p>Olá ${nome},</p>
    <p>Seu cadastro na plataforma <strong>Connexa</strong> foi realizado com sucesso.</p>
    <p>Obrigado por se inscrever utilizando seu email institucional.</p>
  `;

  const info = await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject,
    text,
    html,
  });

  if (!process.env.SMTP_HOST) {
    console.log('Email de confirmação enviado via Ethereal: %s', nodemailer.getTestMessageUrl(info));
  }

  return info;
}

module.exports = { sendConfirmationEmail };
