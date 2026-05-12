# Connexa-MVP

Plataforma web para grupos de estudo universitário.

## Stack Tecnológica
- Backend: Node.js + Express
- Banco de dados: SQLite
- Frontend: HTML/CSS/JS (futuramente React)

## Instalação e Execução

1. Instalar dependências:
```bash
npm install
```

2. Iniciar o servidor:
```bash
npm start
```

Ou para desenvolvimento:
```bash
npm run dev
```

O servidor roda na porta 3000 por padrão.

## Configuração de Email

O envio de email de confirmação funciona usando variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto com as configurações abaixo, ou use o servidor de teste Ethereal se não houver SMTP configurado.

```env
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario@example.com
SMTP_PASS=sua_senha
EMAIL_FROM="Connexa <no-reply@connexa.edu.br>"
```

Se nenhuma variável SMTP for fornecida, o projeto usará um servidor Ethereal temporário e exibirá a URL de pré-visualização no log.

## API Endpoints

### POST /api/usuarios/cadastro
Cadastra um novo usuário no sistema.

**Corpo da requisição (JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta de sucesso (201):**
```json
{
  "mensagem": "Usuário cadastrado com sucesso.",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com"
  }
}
```

**Respostas de erro:**
- 400: Campos obrigatórios não preenchidos
- 409: Email já cadastrado
- 500: Erro interno do servidor

## Estrutura do Projeto
```
Connexa-MVP/
├── backend/
│   ├── database.js          # Configuração do banco SQLite
│   ├── server.js            # Servidor Express
│   └── src/
│       ├── controllers/     # Controladores da API
│       ├── models/          # Modelos de dados
│       ├── routes/          # Definição das rotas
│       └── services/        # Lógica de negócio
├── database/                # Arquivos do banco de dados
├── frontend/                # Arquivos do frontend
└── package.json
```