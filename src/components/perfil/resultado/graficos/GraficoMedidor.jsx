import React from "react";
import { Gauge } from "@mui/x-charts";
import styles from "./GraficoGaugeTempo.module.css";

const jogosEsperados = ["Memória", "Números", "Vogais", "Cores"];

// Agora só garante número válido (não converte mais minutos)
const normalizarTempo = (tempo) => {
  const valor = Number(tempo);
  if (isNaN(valor) || valor < 0) return 0;
  return Math.floor(valor);
};

const formatarTempo = (segundos) => {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}m ${seg.toString().padStart(2, "0")}s`;
};

const GraficoGaugeTempo = ({ dados = [] }) => {
  // 🔥 melhora performance (evita find dentro do map)
  const dadosMap = new Map(dados.map((d) => [d.jogo, d]));

  const temposPorJogo = jogosEsperados.map((jogo) => {
    const entrada = dadosMap.get(jogo);

    const tempoGasto =
      entrada?.tempoTotal != null ? normalizarTempo(entrada.tempoTotal) : 0;

    return {
      jogo,
      tempo: tempoGasto,
    };
  });

  const maxTempo = Math.max(...temposPorJogo.map((t) => t.tempo), 60);

  return (
    <div>
      <h3>Tempo gasto por jogo</h3>
      <div className={styles.container}>
        {temposPorJogo.map(({ jogo, tempo }) => (
          <div key={jogo} className={styles.graficoItem}>
            <Gauge
              value={Math.min(tempo, maxTempo)}
              valueMax={maxTempo + 20}
              startAngle={-110}
              endAngle={110}
              sx={{
                "& .MuiGauge-valueArc": {
                  fill: "rgb(0, 183, 255)",
                },
              }}
              text={() => `${formatarTempo(tempo)}`}
            />
            <p>{jogo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficoGaugeTempo;
