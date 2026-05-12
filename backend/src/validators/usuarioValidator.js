const UNIVERSITY_DOMAIN = '@universidade.edu.br';
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function camposObrigatoriosPresentes({ nome, email, senha }) {
  return Boolean(nome && email && senha);
}

function emailValido(email) {
  return EMAIL_REGEX.test(email);
}

function emailUniversitario(email) {
  return typeof email === 'string' && email.toLowerCase().endsWith(UNIVERSITY_DOMAIN);
}

function senhaValida(senha) {
  return PASSWORD_REGEX.test(senha);
}

module.exports = {
  camposObrigatoriosPresentes,
  emailValido,
  emailUniversitario,
  senhaValida,
  UNIVERSITY_DOMAIN,
};
