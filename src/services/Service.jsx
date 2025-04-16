import axios from "axios";

<<<<<<< HEAD
/**
  * @callback setDados - Função para atualizar o estado com a resposta da API
  * @param {import("axios").AxiosResponse} Resposta retornada pela API
  */

// Cria uma instância do axios para realizar as requisições HTTP.
// A `baseURL` aponta para a URL base da API que será chamada.
const api = axios.create({
    // A URL base é definida usando uma variável de ambiente ou um valor padrão.
    // Aqui, está sendo utilizada uma URL local para desenvolvimento.
    baseURL: 'https://backend-9qjw.onrender.com/'
});

/**
  * Realiza uma requisição POST para cadastrar um novo usuário.
  * @param {string} url - A URL específica do endpoint para cadastro.
  * @param {Object} dados - Os dados do usuário a serem enviados no corpo da requisição.
  * @param {setDados} setDados - Função para atualizar o estado com a resposta da API.
  */
export const cadastrarUsuario = async (url, dados, setDados) => {
    const resposta = await api.post(url, dados); // Envia os dados para o servidor.
    setDados(resposta.data); // Atualiza o estado com os dados retornados pela API.
};

/**
 * Realiza uma requisição POST para autenticação (login) de um usuário.
 * @param {string} url - A URL específica do endpoint de login.
 * @param {Object} dados - Credenciais de login (e.g., email e senha).
 * @param {setDados} setDados - Função para armazenar o token de autenticação e outras informações retornadas.
 */
export const login = async (url, dados, setDados) => {
    const resposta = await api.post(url, dados); // Envia as credenciais para autenticar.
    setDados(resposta.data); // Atualiza o estado com os dados retornados pela API.
};

/**
 * Realiza uma requisição GET para buscar informações do servidor.
 * @param {string} url - A URL específica do endpoint.
 * @param {setDados} setDados - Função para armazenar os dados retornados pela API.
 * @param {Object} header - Cabeçalhos adicionais para autenticação ou configurações da requisição.
 */
export const buscar = async (url, setDados, header) => {
    const resposta = await api.get(url, header); // Faz uma requisição GET para buscar dados.
    setDados(resposta.data); // Atualiza o estado com os dados retornados pela API.
};

/**
 * Realiza uma requisição POST para criar um novo recurso no servidor.
 * @param {string} url - A URL específica do endpoint.
 * @param {Object} dados - Os dados a serem enviados no corpo da requisição.
 * @param {setDados} setDados - Função para armazenar os dados retornados pela API.
 * @param {Object} header - Cabeçalhos adicionais para autenticação ou configurações da requisição.
 */
export const cadastrar = async (url, dados, setDados, header) => {
    const resposta = await api.post(url, dados, header); // Envia os dados para o servidor.
    setDados(resposta.data); // Atualiza o estado com os dados retornados pela API.
};

/**
 * Realiza uma requisição PUT para atualizar um recurso existente no servidor.
 * @param {string} url - A URL específica do endpoint.
 * @param {Object} dados - Os dados a serem enviados no corpo da requisição para atualização.
 * @param {setDados} setDados - Função para armazenar os dados retornados pela API.
 * @param {Object} header - Cabeçalhos adicionais para autenticação ou configurações da requisição.
 */
export const atualizar = async (url, dados, setDados, header) => {
    const resposta = await api.put(url, dados, header); // Envia os dados atualizados para o servidor.
    setDados(resposta.data); // Atualiza o estado com os dados retornados pela API.
};

/**
 * Realiza uma requisição DELETE para remover um recurso no servidor.
 * @param {string} url - A URL específica do endpoint.
 * @param {Object} header - Cabeçalhos adicionais para autenticação ou configurações da requisição.
 */
export const deletar = async (url, header) => {
    await api.delete(url, header); // Envia uma requisição DELETE para o servidor.
};


// jogos
export const registrarJogo = async (url, dados, setDados, header) => {
    const resposta = await api.post(url, dados, header)
    setDados(resposta.data)
}
=======
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
>>>>>>> 13177b8724d5cd57b37e8b3292045013ae8afe12
