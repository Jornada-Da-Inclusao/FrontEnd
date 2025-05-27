import React from "react";
import { Gauge } from "@mui/x-charts";
import styles from "./GraficoGaugeTempo.module.css";

const jogosEsperados = ["Memória", "Números", "Vogais", "Cores"];

const convertToSeconds = (time) => {
  if (typeof time === "number") {
    return Math.floor(time * 60);
  }
  return 0;
};

const formatarTempo = (segundos) => {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}m ${seg.toString().padStart(2, "0")}s`;
};

const GraficoGaugeTempo = ({ dados }) => {
  const TEMPO_MAXIMO = 180; // 3 minutos em segundos

  const temposPorJogo = jogosEsperados.map((jogo) => {
    const entrada = dados.find((d) => d.jogo === jogo);

    let tempoGasto = 0;
    if (entrada && entrada.tempoTotal > 0) {
      const tempoRestanteSeg = convertToSeconds(entrada.tempoTotal);
      tempoGasto = TEMPO_MAXIMO - tempoRestanteSeg;
      if (tempoGasto < 0) tempoGasto = 0;
    }

    return {
      jogo,
      tempo: tempoGasto,
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
                "& .MuiGauge-valueArc": {
                  fill: "rgb(0, 183, 255)",
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
