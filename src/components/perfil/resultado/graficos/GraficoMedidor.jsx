import React from "react";
import { Gauge } from "@mui/x-charts";
import styles from "./GraficoGaugeTempo.module.css"; // Importando o CSS Module

const jogosEsperados = ["Memória", "Números", "Vogais", "Cores"];

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
      tempo: entrada ? entrada.tempoTotal : 0 // Usando tempoTotal em segundos
    };
  });

  return (
    <div>
      <h3>Tempo gasto por jogo</h3>
      <div className={styles.container}>
        {temposPorJogo.map(({ jogo, tempo }) => (
          <div key={jogo} className={styles.graficoItem}>
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
            <p>{jogo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficoGaugeTempo;
