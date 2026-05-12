const db = require('../../database');

class Usuario {
  static criar(dados, callback) {
    const { nome, email, senha, bio = '', foto = '' } = dados;
    const sql = 'INSERT INTO usuarios (nome, email, senha, bio, foto) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [nome, email, senha, bio, foto], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, nome, email, bio, foto });
    });
  }

  static buscarPorEmail(email, callback) {
    const sql = 'SELECT * FROM usuarios WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, row);
    });
  }

  static buscarPorId(id, callback) {
    const sql = 'SELECT id, nome, email, bio, foto, senha, data_criacao FROM usuarios WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return callback(err);
      }
      callback(null, row);
    });
  }

  static buscarPorEmailAsync(email) {
    return new Promise((resolve, reject) => {
      this.buscarPorEmail(email, (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  static buscarPorIdAsync(id) {
    return new Promise((resolve, reject) => {
      this.buscarPorId(id, (err, row) => {
        if (err) {
          return reject(err);
        }
        resolve(row);
      });
    });
  }

  static atualizarPorId(id, dados, callback) {
    const { nome, bio = '', foto = '', senha } = dados;
    const sql = 'UPDATE usuarios SET nome = ?, bio = ?, foto = ?, senha = ? WHERE id = ?';
    db.run(sql, [nome, bio, foto, senha, id], function(err) {
      if (err) {
        return callback(err);
      }
      callback(null, { changes: this.changes });
    });
  }

  static criarAsync(dados) {
    return new Promise((resolve, reject) => {
      this.criar(dados, (err, usuario) => {
        if (err) {
          return reject(err);
        }
        resolve(usuario);
      });
    });
  }

  static atualizarAsync(id, dados) {
    return new Promise((resolve, reject) => {
      this.atualizarPorId(id, dados, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = Usuario;