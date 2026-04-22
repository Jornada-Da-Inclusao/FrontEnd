import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const GraficoTentativas = ({ dados, viewMode }) => {
  const jogos = ["Memória", "Números", "Vogais", "Cores"];

  const data = jogos.map((jogo) => {
    const jogoData = dados.find((item) => item.jogo === jogo);
    return {
      nome: jogo,
      tentativas: jogoData ? jogoData.totalAcertos + jogoData.totalErros : 0,
      totalAcertos: jogoData ? jogoData.totalAcertos : 0,
      totalErros: jogoData ? jogoData.totalErros : 0,
      jogo: jogo,
    };
  });

  return (
    <div style={{ width: "100%", height: "auto" }}>
      <h3>
        Tentativas, Acertos e totalErros por{" "}
        {viewMode === "geral" ? "Jogo" : "Jogo"}
      </h3>
      <ResponsiveContainer width="100%" height={data.length * 50}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="nome" type="category" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="tentativas"
            stackId="a"
            fill="#FF9800"
            name="Tentativas"
          />
          <Bar
            dataKey="totalAcertos"
            stackId="b"
            fill="#4CAF50"
            name="totalAcertos"
          />
          <Bar
            dataKey="totalErros"
            stackId="b"
            fill="#F44336"
            name="totalErros"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoTentativas;
