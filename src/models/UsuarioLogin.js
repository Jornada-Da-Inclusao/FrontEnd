/**
 * @typedef {Object} UsuarioLogin
 * @param {number} id Identificador único do usuário, geralmente gerado automaticamente pelo sistema.
 * @param {string} nome Nome do responsável, como um pai ou guardião.
 * @param {string} usuario E-mail do usuário ou responsável, usado para login e comunicação.
 * @param {string} senha Senha para autenticação do usuário, usada para proteger o acesso à conta.
 * @param {string} foto
 * @param {string} token
 */
const UsuarioLogin = {
  id: 0,
  nome: "",
  usuario: "",
  senha: "",
  foto: "",
  token: "",
};

export default UsuarioLogin;
