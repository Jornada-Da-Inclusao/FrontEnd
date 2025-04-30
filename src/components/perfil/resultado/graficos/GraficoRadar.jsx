// src/components/GraficoRadar.jsx
import React from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer,
} from "recharts";

const GraficoRadar = ({ dados, nome }) => {
  // Filtra apenas os jogos da criança selecionada
  const jogosDaCrianca = dados.filter((d) => d.nome === nome);

  if (!nome || jogosDaCrianca.length === 0) return null;

  // Monta os dados no formato:
  // [
  //   { metrica: 'acertos', "Jogo da Memória": 8, "Jogo das Letras": 5, ... },
  //   { metrica: 'erros', ... },
  //   { metrica: 'tempo', ... },
  // ]
  const metricas = ["acertos", "erros", "tempo"];
  const radarData = metricas.map((metrica) => {
    const item = { metrica };
    jogosDaCrianca.forEach((jogo) => {
      item[jogo.jogo] = jogo[metrica];
    });
    return item;
  });

  const cores = ["#8884d8", "#82ca9d", "#ffc658", "#f44336", "#2196f3", "#795548"];

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3>Comparativo de desempenho nos jogos de {nome}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metrica" />
          <PolarRadiusAxis />
          <Tooltip />
          <Legend />
          {jogosDaCrianca.map((jogo, index) => (
            <Radar
              key={jogo.jogo}
              name={jogo.jogo}
              dataKey={jogo.jogo}
              stroke={cores[index % cores.length]}
              fill={cores[index % cores.length]}
              fillOpacity={0.4}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoRadar;
