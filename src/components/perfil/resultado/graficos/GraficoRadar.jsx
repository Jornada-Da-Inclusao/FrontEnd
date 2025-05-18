import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GraficoRadar = ({ dados, nome }) => {
  if (!nome || !dados) return null;

  // Mapeamento de jogos para áreas
  const mapaJogos = {
    "Memória": "Memorização",
    "Letras": "Alfabetização inicial",
    "Números": "Raciocinio logico-matematico",
    "Cores": "Percepção visual",
  };

  // Inicializa os dados com 0%
  const radarData = Object.values(mapaJogos).map((area) => ({
    area,
    Porcentagem: 0,
  }));

  // Agrupa os dados da criança por jogo
  const jogosDaCrianca = dados.filter((d) => d.nome === nome);

  jogosDaCrianca.forEach((jogo) => {
    const area = mapaJogos[jogo.jogo];
    if (area) {
      const index = radarData.findIndex((item) => item.area === area);
      const total = jogo.acertos + jogo.erros;
      if (total > 0) {
        radarData[index].Porcentagem = Math.round((jogo.acertos / total) * 100);
      }
    }
  });

  return (
    <div style={{ width: "100%", height: 350 }}>
      <h3>Desempenho por capacidade de {nome} (%)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="area" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Radar
            name="Desempenho (%)"
            dataKey="Porcentagem"
            stroke="#4CAF50"
            fill="#4CAF50"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoRadar;
