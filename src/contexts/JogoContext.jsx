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
    console.log(token);
    try {
        // Supondo que registrarJogo seja uma função que envia os dados para uma API
        await registrarJogo(`/infoJogos`, infoJogos, setInfoJogos, {
            headers: {
                Authorization: token,
            },
        });

        return {
            code: 200,
        };
    } catch (error) {
        console.log(error);

        // Caso ocorra um erro
        return {
            code: 500,
        };
    }
    
}


    // Retorna o provedor com as variáveis de contexto
    return (
        <JogoContext.Provider value={{ registrarInfos }}>
            {children}
        </JogoContext.Provider>
    );
}