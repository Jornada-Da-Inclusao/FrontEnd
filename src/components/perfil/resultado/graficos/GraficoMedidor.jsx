// src/components/GraficoGaugeTempo.jsx
import React from "react";
import { Gauge } from "@mui/x-charts/Gauge";

const GraficoGaugeTempo = ({ dados }) => {
  const totalTempo = dados.reduce((acc, curr) => acc + curr.tempo, 0);
  const media = dados.length ? totalTempo / dados.length : 0;

  return (
    <div style={{ width: 300, height: 300 }}>
      <h3>Tempo médio nos jogos</h3>
      <Gauge value={media} valueMax={300} startAngle={-110} endAngle={110} />
    </div>
  );
};

export default GraficoGaugeTempo;
