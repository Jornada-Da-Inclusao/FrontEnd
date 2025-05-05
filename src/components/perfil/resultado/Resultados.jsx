import React, { useState, useEffect } from "react";
import styles from "../resultado/Resultados.module.css";
import resultados from "./dadosFicticios";

// Componentes dos gráficos
import BarSizeChart from "../resultado/graficos/GraficoBarSize";
import GaugeChart from "../resultado/graficos/GraficoMedidor";
import RadarChart from "../resultado/graficos/GraficoRadar";

const Resultados = () => {
  const [nameFilter, setNameFilter] = useState(""); // Filtrando por nome da criança
  const [tipoGrafico, setTipoGrafico] = useState("bar"); // "bar", "gauge" ou "radar"
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

  // Obter todos os nomes únicos dos jogadores
  const nomesUnicos = [...new Set(resultados.map((r) => r.nome))];

  useEffect(() => {
    if (nameFilter === "") {
      setResultadosFiltrados([]); // Se não houver filtro, limpar os resultados
    } else {
      const filtrados = resultados.filter((r) => r.nome === nameFilter);
      setResultadosFiltrados(filtrados);
    }
  }, [nameFilter]);

  const renderGrafico = () => {
    if (nameFilter === "") return <p>Selecione uma criança para ver o desempenho.</p>;

    switch (tipoGrafico) {
      case "bar":
        return <BarSizeChart dados={resultadosFiltrados} viewMode="individual" />;
      case "gauge":
        return <GaugeChart dados={resultadosFiltrados} viewMode="individual" />;
      case "radar":
        return <RadarChart dados={resultadosFiltrados} nome={nameFilter} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Resultados dos Jogos</h2>
        <h3>Acompanhe o desempenho das crianças nos jogos educativos.</h3>

        <section className={styles.filter}>
          <label>Filtrar por nome:</label>
          <select value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}>
            <option value="" disabled>Selecione uma criança</option>
            {nomesUnicos.map((nome) => (
              <option key={nome} value={nome}>{nome}</option>
            ))}
          </select>

          <label>Modo de visualização:</label>
          <select value={tipoGrafico} onChange={(e) => setTipoGrafico(e.target.value)}>
            <option value="bar">Tentativas, Acertos e Erros</option>
            <option value="gauge">Tempo</option>
            <option value="radar">Desempenho por capacidades</option>
          </select>
        </section>

        {resultadosFiltrados.length > 0 && (
          <section className={styles.textContent}>
            {renderGrafico()}
          </section>
        )}
      </div>
    </div>
  );
};

export default Resultados;
