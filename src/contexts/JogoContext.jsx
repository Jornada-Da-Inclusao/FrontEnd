import React, { createContext, useState } from "react";
import { registrarJogo } from "../services/Service"; // Certifique-se de que essa função esteja correta e importada

// Criação do contexto
export const JogoContext = createContext({});

// Provedor de contexto para gerenciar o estado e a função de registro
export function JogoProvider({ children }) {


    const [infoJogos, setInfoJogos] = useState({
        "tempoTotal": 0,
        "tentativas": 0,
        "acertos": 0,
        "erros": 0,
        "infoJogos_id_fk": {
          "id": 0
        },
        "dependente": {
            "id": 0
        }
    });
    // Função para registrar as informações do jogo
    async function registrarInfos(infoJogos, token) {
        try {
            const response = await registrarJogo(`/infoJogos`, infoJogos, setInfoJogos, {
                headers: {
                    Authorization: token,
                },
            });
            console.log(response);
            
            return response;
        } catch (error) {
            console.error("Erro ao registrar informações:", error);
            return null; // ou: return { error: true, message: error.message }
        }
    }    


    // Retorna o provedor com as variáveis de contexto
    return (
        <JogoContext.Provider value={{ registrarInfos }}>
            {children}
        </JogoContext.Provider>
    );
}