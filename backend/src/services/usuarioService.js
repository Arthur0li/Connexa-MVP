const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const { sendConfirmationEmail } = require('./emailService');
const {
  camposObrigatoriosPresentes,
  emailValido,
  emailUniversitario,
  senhaValida,
  UNIVERSITY_DOMAIN,
} = require('../validators/usuarioValidator');

const SALT_ROUNDS = 10;

async function cadastrarUsuario({ nome, email, senha }) {
  if (!camposObrigatoriosPresentes({ nome, email, senha })) {
    throw { status: 400, message: 'Nome, email e senha são obrigatórios.' };
  }

  if (!emailValido(email)) {
    throw { status: 400, message: 'Email inválido. Use um endereço de email institucional.' };
  }

  if (!emailUniversitario(email)) {
    throw { status: 400, message: `Email deve ser do domínio ${UNIVERSITY_DOMAIN}.` };
  }

  if (!senhaValida(senha)) {
    throw {
      status: 400,
      message: 'Senha deve ter pelo menos 8 caracteres e incluir maiúsculas, minúsculas e números.',
    };
  }

  const usuarioExistente = await Usuario.buscarPorEmailAsync(email);
  if (usuarioExistente) {
    throw { status: 409, message: 'Email já cadastrado.' };
  }

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
  const usuario = await Usuario.criarAsync({ nome, email, senha: senhaHash });

  /* let emailEnviado = false;
  try {
    await sendConfirmationEmail({ nome, email });
    emailEnviado = true;
  } catch (err) {
    console.error('Falha ao enviar email de confirmação:', err);
  }*/

  const emailEnviado = false;
  
  return { usuario, emailEnviado };
} 

async function buscarUsuarioPorId(id) {
  if (!id) {
    throw { status: 400, message: 'ID de usuário inválido.' };
  }

  const usuario = await Usuario.buscarPorIdAsync(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  return usuario;
}

async function atualizarUsuario(id, { nome, bio = '', foto = '', novaSenha = '', confirmacaoSenha = '' }) {
  if (!id) {
    throw { status: 400, message: 'ID de usuário inválido.' };
  }

  if (!nome || nome.trim().length < 3) {
    throw { status: 400, message: 'Nome é obrigatório e deve ter pelo menos 3 caracteres.' };
  }

  if (novaSenha || confirmacaoSenha) {
    if (novaSenha !== confirmacaoSenha) {
      throw { status: 400, message: 'Nova senha e confirmação devem ser iguais.' };
    }

    if (!senhaValida(novaSenha)) {
      throw {
        status: 400,
        message: 'Nova senha deve ter pelo menos 8 caracteres e incluir maiúsculas, minúsculas e números.',
      };
    }
  }

  const usuarioExistente = await Usuario.buscarPorIdAsync(id);
  if (!usuarioExistente) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  const senhaHash = novaSenha ? await bcrypt.hash(novaSenha, SALT_ROUNDS) : usuarioExistente.senha;

  await Usuario.atualizarAsync(id, {
    nome: nome.trim(),
    bio: bio.trim(),
    foto: foto.trim(),
    senha: senhaHash,
  });

  const usuarioAtualizado = await Usuario.buscarPorIdAsync(id);
  return usuarioAtualizado;
}

module.exports = {
  cadastrarUsuario,
  buscarUsuarioPorId,
  atualizarUsuario,
};
