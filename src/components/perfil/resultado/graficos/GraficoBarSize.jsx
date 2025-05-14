import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const GraficoTentativas = ({ dados, viewMode }) => {
  // Definindo os jogos predefinidos
  const jogos = ["Jogo Memória", "Jogo Números", "Jogo Letras", "Jogo Cores"];

  // Mapeando os dados para incluir todos os jogos, preenchendo com zero se não houver dados
  const data = jogos.map((jogo) => {
    // Procurar se há dados para o jogo atual
    const jogoData = dados.find((item) => item.jogo === jogo);

    // Se houver dados para o jogo, usa eles, senão coloca zero
    return {
      nome: jogo,
      tentativas: jogoData ? jogoData.acertos + jogoData.erros : 0,  // Total de tentativas (acertos + erros)
      acertos: jogoData ? jogoData.acertos : 0,  // Acertos
      erros: jogoData ? jogoData.erros : 0,  // Erros
      jogo: jogo,  // Nome do jogo
    };
  });

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>
        Tentativas, Acertos e Erros por {viewMode === "geral" ? "Jogo" : "Criança"}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tentativas" stackId="a" fill="#FF9800" name="Tentativas" />
          <Bar dataKey="acertos" stackId="b" fill="#4CAF50" name="Acertos" />
          <Bar dataKey="erros" stackId="b" fill="#F44336" name="Erros" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoTentativas;
