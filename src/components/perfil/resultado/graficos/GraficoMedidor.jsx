import React from "react";
import { Gauge } from "@mui/x-charts";

const jogosEsperados = ["Memória", "Números", "Vogais", "Cores"];

// Função auxiliar para formatar segundos em minutos e segundos
const formatarTempo = (segundos) => {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}m ${seg.toString().padStart(2, "0")}s`;
};

const GraficoGaugeTempo = ({ dados }) => {
  const TEMPO_MAXIMO = 180;

  // Aqui assumo que "jogo" está presente no objeto "dados" para casar com jogosEsperados.
  // Caso não tenha, você precisará mapear de outra forma.
  const temposPorJogo = jogosEsperados.map((jogo) => {
    // Procura o objeto do jogo correspondente, adaptando para seu dado real
    const entrada = dados.find((d) => d.jogo === jogo);

    return {
      jogo,
      tempo: entrada ? entrada.tempoTotal : 0 // Usando tempoTotal em segundos
    };
  });

  return (
    <div>
      <h3>Tempo gasto por jogo</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-evenly" }}>
        {temposPorJogo.map(({ jogo, tempo }) => (
          <div key={jogo} style={{ width: 250, height: 150, textAlign: "center", fontSize: "small" }}>
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