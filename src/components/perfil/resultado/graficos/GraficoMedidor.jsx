import React from "react";
import { Gauge } from "@mui/x-charts";

const jogosEsperados = ["Memória", "Números", "Letras", "Cores"]

// Função auxiliar para formatar segundos em minutos e segundos
const formatarTempo = (segundos) => {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}m ${seg.toString().padStart(2, "0")}s`;
};

const GraficoGaugeTempo = ({ dados }) => {
  const TEMPO_MAXIMO = 180;

  const temposPorJogo = jogosEsperados.map((jogo) => {
    const entrada = dados.find((d) => d.jogo === jogo);
    return {
      jogo,
      tempo: entrada ? entrada.tempo : 0
    };
  });

  return (
    <div>
      <h3>Tempo gasto por jogo</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-evenly" }}>
        {temposPorJogo.map(({ jogo, tempo }) => (
          <div key={jogo} style={{ width: 160, height: 220, textAlign: "center", fontSize: "small" }}>
            <Gauge
              value={Math.min(tempo, TEMPO_MAXIMO)}
              valueMax={TEMPO_MAXIMO}
              startAngle={-110}
              endAngle={110}
              sx={{
                '& .MuiGauge-valueArc': {
                  fill: 'rgb(0, 183, 255)',
                },
              }}
              text={() =>
                `${formatarTempo(tempo)} / ${formatarTempo(TEMPO_MAXIMO)}`
              }
            />
            <p style={{ fontWeight: "bold", marginTop: -25, color: "black" }}>{jogo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficoGaugeTempo;
