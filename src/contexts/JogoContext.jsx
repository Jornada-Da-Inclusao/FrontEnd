import React, { createContext } from "react";
import { JogoService } from "../services/jogo.service";

// Criação do contexto
export const JogoContext = createContext({});

export function JogoProvider({ children }) {
  const initialState = {
    tempoTotal: 0,
    tentativas: 0,
    acertos: 0,
    erros: 0,
    infoJogos_id_fk: {
      id: 0,
    },
    dependente: {
      id: 0,
    },
  };

  // Função para registrar informações do jogo
  async function registrarInfos(infoJogos) {
    try {
      const response = await JogoService.registrar(infoJogos);
      return response;
    } catch (error) {
      console.error("Erro ao registrar informações:", error);
      return null;
    }
  }

  return (
    <JogoContext.Provider value={{ registrarInfos, initialState }}>
      {children}
    </JogoContext.Provider>
  );
}
