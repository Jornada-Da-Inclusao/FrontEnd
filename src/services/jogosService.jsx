// src/services/jogosService.js
import axios from "axios";

const API_URL = "https://backend-9qjw.onrender.com/infoJogos";

export const getJogosPorDependente = async (dependenteId) => {
  try {
    // Recuperar o token de autenticação do sessionStorage
    const token = localStorage.getItem("token");

    // Verificar se o token existe
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    // Enviar o token de autenticação nos headers
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: token, // Enviar o token como 'Bearer token'
      },
    });

    // Filtrar os jogos pelo ID do dependente
    const jogosFiltrados = response.data.filter(
      (jogo) => jogo.dependente.id === parseInt(dependenteId)
    );
    
    return jogosFiltrados;
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return [];
  }
};
