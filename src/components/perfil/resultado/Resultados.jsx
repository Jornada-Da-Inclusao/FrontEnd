// src/pages/Resultados.jsx
import React, { useState, useEffect } from "react";
import styles from "../resultado/Resultados.module.css";
import GraficoDesempenho from "../components/GraficoDesempenho";
import resultados from "./resultados";

const Resultados = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [viewMode, setViewMode] = useState("individual");
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

  useEffect(() => {
    if (viewMode === "geral") {
      const agrupados = resultados.reduce((acc, curr) => {
        const key = curr.jogo;
        if (!acc[key]) {
          acc[key] = {
            jogo: curr.jogo,
            acertos: 0,
            erros: 0,
            tempo: 0,
          };
        }
        acc[key].acertos += curr.acertos;
        acc[key].erros += curr.erros;
        acc[key].tempo += curr.tempo;
        return acc;
      }, {});
      setResultadosFiltrados(Object.values(agrupados));
    } else {
      const filtrados = resultados.filter((r) => nameFilter === "" || r.nome === nameFilter);
      setResultadosFiltrados(filtrados);
    }
  }, [nameFilter, viewMode]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Resultados dos Jogos</h2>
        <h3>Acompanhe o desempenho das crianças nos jogos educativos.</h3>

        <section className={styles.filter}>
          <label>Modo de visualização:</label>
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <option value="individual">Resultados por criança</option>
            <option value="geral">Resultados gerais por jogo</option>
          </select>

          {viewMode === "individual" && (
            <>
              <label>Filtrar por nome:</label>
              <select value={nameFilter} onChange={(e) => setNameFilter(e.target.value)}>
                <option value="">Todos</option>
                <option value="João">João</option>
                <option value="Maria">Maria</option>
                <option value="Lucas">Lucas</option>
                <option value="Ana">Ana</option>
                <option value="Carla">Carla</option>
              </select>
            </>
          )}
        </section>

        {resultadosFiltrados.length > 0 && (
          <section className={styles.textContent}>
            <GraficoDesempenho dados={resultadosFiltrados} viewMode={viewMode} nome={nameFilter} />
          </section>
        )}
      </div>
    </div>
  );
};

export default Resultados;
