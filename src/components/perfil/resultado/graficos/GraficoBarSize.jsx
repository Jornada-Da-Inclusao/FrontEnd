// src/components/GraficoTentativas.jsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const GraficoTentativas = ({ dados, viewMode }) => {
  const data = dados.map((item) => ({
    nome: viewMode === "geral" ? item.jogo : item.nome,
    tentativas: item.acertos + item.erros,
  }));

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Tentativas por {viewMode === "geral" ? "Jogo" : "Criança"}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nome" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tentativas" fill="#FF9800" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoTentativas;
