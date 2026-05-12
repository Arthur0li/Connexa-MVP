const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');

const router = express.Router();

// Rota para cadastrar usuário
router.post('/cadastro', UsuarioController.cadastrar);

// Rotas de perfil do usuário
router.get('/:id', UsuarioController.buscarPorId);
router.put('/:id', UsuarioController.atualizar);

module.exports = router;