const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados
const dbPath = path.join(__dirname, '../database/connexa.db');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Criar tabelas se não existirem
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      bio TEXT DEFAULT '',
      foto TEXT DEFAULT '',
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Adiciona colunas extras em bases antigas sem quebrar execução
  db.run('ALTER TABLE usuarios ADD COLUMN bio TEXT DEFAULT ""', err => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Erro ao adicionar coluna bio:', err.message);
    }
  });
  db.run('ALTER TABLE usuarios ADD COLUMN foto TEXT DEFAULT ""', err => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Erro ao adicionar coluna foto:', err.message);
    }
  });

  // Tabela de grupos (para referência futura)
  db.run(`
    CREATE TABLE IF NOT EXISTS grupos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      materia TEXT NOT NULL,
      descricao TEXT,
      criador_id INTEGER,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (criador_id) REFERENCES usuarios (id)
    )
  `);
});

module.exports = db;
