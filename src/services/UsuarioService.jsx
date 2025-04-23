import axios from "axios";

// Cria uma instância do axios para realizar as requisições HTTP.
const api = axios.create({
  baseURL: 'https://backend-9qjw.onrender.com/'
});

/**
 * Realiza uma requisição POST para cadastrar um novo usuário.
 * @param {string} url - Endpoint de cadastro.
 * @param {object} dados - Dados do usuário.
 * @param {function} setDados - Função para atualizar o estado com a resposta.
 */
export const cadastrarUsuario = async (url, dados, setDados) => {
  const resposta = await api.post(url, dados);
  setDados(resposta.data);
};

/**
 * Realiza uma requisição POST para autenticação (login).
 * @param {string} url - Endpoint de login.
 * @param {object} dados - Credenciais do usuário.
 * @param {function} setDados - Função para armazenar a resposta.
 */
export const login = async (url, dados, setDados) => {
  const resposta = await api.post(url, dados);
  setDados(resposta.data);
};

/**
 * Realiza uma requisição GET para buscar dados.
 * @param {string} url - Endpoint.
 * @param {function} setDados - Função para armazenar a resposta.
 * @param {object} header - Cabeçalhos da requisição.
 */
export const buscar = async (url, setDados, header) => {
  const resposta = await api.get(url, header);
  setDados(resposta.data);
};

/**
 * Realiza uma requisição POST para criar um recurso.
 * @param {string} url - Endpoint.
 * @param {object} dados - Dados para envio.
 * @param {function} setDados - Função para armazenar a resposta.
 * @param {object} header - Cabeçalhos da requisição.
 */
export const cadastrar = async (url, dados, setDados, header) => {
  const resposta = await api.post(url, dados, header);
  setDados(resposta.data);
};

/**
 * Realiza uma requisição PUT para atualizar um recurso.
 * @param {string} url - Endpoint.
 * @param {object} dados - Dados atualizados.
 * @param {function} setDados - Função para armazenar a resposta.
 * @param {object} header - Cabeçalhos da requisição.
 */
export const atualizar = async (url, dados, setDados, header) => {
  const resposta = await api.put(url, dados, header);
  setDados(resposta.data);
};

/**
 * Realiza uma requisição DELETE para excluir um recurso.
 * @param {string} url - Endpoint.
 * @param {object} header - Cabeçalhos da requisição.
 */
export const deletar = async (url, header) => {
  await api.delete(url, header);
};

export const atualizarUsuario = async (dadosAtualizados, token) => {
  console.log(dadosAtualizados)
  try {
    const response = await fetch("https://backend-9qjw.onrender.com/usuarios/atualizar-parcial", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(dadosAtualizados)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Detalhes do erro:", errorData);
      throw new Error("Erro ao atualizar usuário");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro dentro de atualizarUsuario:", error);
    throw error;
  }
};


export const deletarUsuario = async (id, token) => {
  try {
    const response = await fetch(`https://backend-9qjw.onrender.com/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.message || "Erro ao deletar usuário");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

