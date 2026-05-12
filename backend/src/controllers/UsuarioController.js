const { cadastrarUsuario, buscarUsuarioPorId, atualizarUsuario } = require('../services/usuarioService');

class UsuarioController {
  static async cadastrar(req, res) {
    try {
      const { usuario, emailEnviado } = await cadastrarUsuario(req.body);

      const mensagem = emailEnviado
        ? 'Usuário cadastrado com sucesso. Email de confirmação enviado.'
        : 'Usuário cadastrado com sucesso, mas não foi possível enviar o email de confirmação no momento.';

      return res.status(201).json({ mensagem, usuario });
    } catch (err) {
      if (err && err.status && err.message) {
        return res.status(err.status).json({ erro: err.message });
      }

      console.error('Erro inesperado no cadastro de usuário:', err);
      return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const usuario = await buscarUsuarioPorId(req.params.id);
      return res.json({ usuario });
    } catch (err) {
      if (err && err.status && err.message) {
        return res.status(err.status).json({ erro: err.message });
      }

      console.error('Erro inesperado ao buscar usuário:', err);
      return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }

  static async atualizar(req, res) {
    try {
      const usuario = await atualizarUsuario(req.params.id, req.body);
      return res.json({ mensagem: 'Perfil atualizado com sucesso.', usuario });
    } catch (err) {
      if (err && err.status && err.message) {
        return res.status(err.status).json({ erro: err.message });
      }

      console.error('Erro inesperado ao atualizar usuário:', err);
      return res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }
}

module.exports = UsuarioController;
