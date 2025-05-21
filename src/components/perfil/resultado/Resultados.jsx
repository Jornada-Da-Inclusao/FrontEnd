import React, { useState, useEffect } from "react";
import styles from "../resultado/Resultados.module.css";
import { Switch, FormControlLabel } from "@mui/material";

import BarSizeChart from "../resultado/graficos/GraficoBarSize";
import GaugeChart from "../resultado/graficos/GraficoMedidor";
import RadarChart from "../resultado/graficos/GraficoRadar";

import { fetchDependentes, downloadExcelInfoJogos, downloadPdfInfoJogos } from "../../../services/dependenteService";
import { getJogosPorDependente } from "../../../services/jogosService";

import { JogosModal } from "../../Modal-custom-alert/JogosModal";

const Resultados = () => {
  const [dependentes, setDependentes] = useState([]);
  const [dependenteSelecionado, setDependenteSelecionado] = useState("");
  const [tipoGrafico, setTipoGrafico] = useState("bar");
  const [historicoJogos, setHistoricoJogos] = useState([]);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);
  const [mostrarUltimoJogo, setMostrarUltimoJogo] = useState(true);
  const [jogosPorTipo, setJogosPorTipo] = useState([]);
  const [jogadaSelecionada, setJogadaSelecionada] = useState(null);

  // Modais
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);

  useEffect(() => {
    const carregarDependentes = async () => {
      try {
        const dependentesAPI = await fetchDependentes();
        setDependentes(dependentesAPI);
      } catch (error) {
        console.error("Erro ao buscar dependentes:", error);
      }
    };
    carregarDependentes();
  }, []);

  useEffect(() => {
    if (!dependenteSelecionado) {
      setHistoricoJogos([]);
      setJogoSelecionado(null);
      setJogosPorTipo([]);
      return;
    }

    sessionStorage.setItem("idDependente", dependenteSelecionado);

    getJogosPorDependente(dependenteSelecionado).then((jogos) => {
      setHistoricoJogos(jogos);

      if (jogos.length > 0) {
        const ordenados = [...jogos].sort(
          (a, b) => new Date(b.createDate) - new Date(a.createDate)
        );

        if (mostrarUltimoJogo) {
          const tiposUnicos = {};
          const ultimosPorTipo = [];

          for (const jogo of ordenados) {
            const nome = jogo.infoJogos_id_fk?.nome?.toLowerCase() || "";
            let tipo;

            if (nome.includes("mem")) tipo = "Memória";
            else if (nome.includes("num")) tipo = "Números";
            else if (nome.includes("vog")) tipo = "Vogais";
            else if (nome.includes("cor")) tipo = "Cores";
            else continue;

            if (!tiposUnicos[tipo]) {
              tiposUnicos[tipo] = true;
              ultimosPorTipo.push(jogo);
            }
          }
          setJogosPorTipo(ultimosPorTipo);
          setJogoSelecionado(null);
        } else {
          setJogoSelecionado(ordenados[0]);
          setJogosPorTipo([]);
        }
      }
    });
  }, [dependenteSelecionado, mostrarUltimoJogo]);

  const padronizarNomeJogo = (nomeOriginal) => {
    if (!nomeOriginal) return "Desconhecido";
    const nome = nomeOriginal.toLowerCase();
    if (nome.includes("mem")) return "Memória";
    if (nome.includes("num")) return "Números";
    if (nome.includes("let")) return "Letras";
    if (nome.includes("vog")) return "Vogais";
    if (nome.includes("cor")) return "Cores";
    return nomeOriginal;
  };

  const renderGrafico = () => {
    if (dependenteSelecionado === "" || (!jogoSelecionado && !mostrarUltimoJogo)) {
      return <p>Selecione uma criança e um jogo para ver o desempenho.</p>;
    }

    const jogosParaMostrar = mostrarUltimoJogo
      ? jogosPorTipo.map((jogo) => ({
        acertos: jogo.acertos,
        erros: jogo.erros,
        tentativas: jogo.tentativas,
        tempoTotal: jogo.tempoTotal > 0 ? jogo.tempoTotal : 1,
        jogo: padronizarNomeJogo(jogo.infoJogos_id_fk?.nome),
      }))
      : [
        {
          acertos: jogoSelecionado.acertos,
          erros: jogoSelecionado.erros,
          tentativas: jogoSelecionado.tentativas,
          tempoTotal: jogoSelecionado.tempoTotal > 0 ? jogoSelecionado.tempoTotal : 1,
          jogo: padronizarNomeJogo(jogoSelecionado.infoJogos_id_fk?.nome),
        },
      ];

    switch (tipoGrafico) {
      case "bar":
        return <BarSizeChart dados={jogosParaMostrar} viewMode="individual" />;
      case "gauge":
        return <GaugeChart dados={jogosParaMostrar} viewMode="individual" />;
      case "radar":
        return <RadarChart dados={jogosParaMostrar} nome={obterNomeDependente()} />;
      default:
        return null;
    }
  };

  const obterNomeDependente = () => {
    const dep = dependentes.find((d) => d.id === parseInt(dependenteSelecionado));
    return dep?.nome || "";
  };

  const formatarData = (data) => {
    const dataFormatada = new Date(data);
    if (isNaN(dataFormatada.getTime())) return null;
    dataFormatada.setHours(dataFormatada.getHours() - 3);
    return dataFormatada;
  };

  const selecionarJogo = (jogo) => {
    setJogoSelecionado(jogo);
    setMostrarUltimoJogo(false);
  };

  const downloadPdf = async () => {
    const idDependente = sessionStorage.getItem("idDependente");
    if (!idDependente) return;

    try {
      await downloadPdfInfoJogos(idDependente);
    } catch (error) {
      console.error("Erro ao gerar o PDF", error);
    }
  };

  const downloadExcel = async () => {
    const idDependente = sessionStorage.getItem("idDependente");
    if (!idDependente) return;

    try {
      await downloadExcelInfoJogos(idDependente);
    } catch (error) {
      console.error("Erro ao gerar o EXCEL", error);
    }
  };

  const buscarHistoricoJogos = async () => {
    if (!dependenteSelecionado) return;
    try {
      const jogos = await getJogosPorDependente(dependenteSelecionado);
      setHistoricoJogos(jogos);
      setJogoSelecionado(null);
      setMostrarUltimoJogo(false);
      setJogosPorTipo([]);
    } catch (error) {
      console.error("Erro ao buscar histórico após exclusão", error);
    }
  };

  const handleOpenDeleteModal = (id) => {
    setJogadaSelecionada(id);
    setModalConfirmDelete(true);
  };

  const deleteJogo = async () => {
    const token = localStorage.getItem("token");
    if (!token || !jogadaSelecionada) return;

    try {
      const response = await fetch(
        `https://backend-9qjw.onrender.com/infoJogos/${jogadaSelecionada}`,
        {
          method: "DELETE",
          headers: { Authorization: token },
        }
      );

      if (!response.ok) throw new Error("Erro ao excluir o jogo.");

      setModalConfirmDelete(false);
      setModalSuccess(true);
      await buscarHistoricoJogos();
    } catch (error) {
      console.error("Erro ao excluir o jogo:", error);
      setModalConfirmDelete(false);
      setModalError(true);
    }
  };

  return (
    <div className={`${styles.container} ${dependenteSelecionado ? "" : styles.centralizado}`}>
      <div className={styles.content}>
        <h2>Resultados dos Jogos</h2>
        <h3>Acompanhe o desempenho das crianças nos jogos educativos.</h3>

        <section className={styles.filter}>
          <label>Filtrar por nome:</label>
          <select
            value={dependenteSelecionado}
            onChange={(e) => setDependenteSelecionado(e.target.value)}
          >
            <option value="" disabled>
              Selecione uma criança
            </option>
            {dependentes.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.nome}
              </option>
            ))}
          </select>

          <label>Modo de visualização:</label>
          <select value={tipoGrafico} onChange={(e) => setTipoGrafico(e.target.value)}>
            <option value="bar">Tentativas, Acertos e Erros</option>
            <option value="gauge">Tempo</option>
            <option value="radar">Desempenho por capacidades</option>
          </select>

          <FormControlLabel
            control={
              <Switch
                checked={mostrarUltimoJogo}
                onChange={() => setMostrarUltimoJogo(!mostrarUltimoJogo)}
                color="primary"
              />
            }
            label="Mostrar último resultado de todos os jogos"
          />
        </section>

        {dependenteSelecionado && historicoJogos.length > 0 && (
          <section className={styles.textContent}>{renderGrafico()}</section>
        )}
      </div>

      {dependenteSelecionado && (
        <div className={styles.content}>
          <div className={styles.headerTop}>
            <h2>Histórico de partidas:</h2>
            <div className={styles.buttons}>
              <button className={styles.relatory} onClick={downloadPdf}>
                Gerar PDF
              </button>
              <button className={styles.relatory} onClick={downloadExcel}>
                Gerar EXCEL
              </button>
            </div>
          </div>
          <div className={styles.history}>
            {historicoJogos.length === 0 ? (
              <p>Carregando histórico...</p>
            ) : (
              historicoJogos
                .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
                .map((jogo) => {
                  const nomeJogo = jogo.infoJogos_id_fk?.nome || "";
                  const data = formatarData(jogo.createDate);
                
                  // Verifica se o jogo está entre os exibidos no modo "mostrarUltimoJogo"
                  const estaSelecionadoNoGrafico =
                    mostrarUltimoJogo &&
                    jogosPorTipo.some((j) => j.id === jogo.id);
                
                  const estaSelecionadoIndividualmente =
                    !mostrarUltimoJogo && jogoSelecionado?.id === jogo.id;
                
                  return (
                    <button
                      key={jogo.id}
                      className={`${styles.btnHistory} ${
                        estaSelecionadoIndividualmente || estaSelecionadoNoGrafico
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => selecionarJogo(jogo)}
                    >
                      {`${nomeJogo} - ${data ? data.toLocaleDateString() : "Data inválida"} ${data ? data.toLocaleTimeString() : ""}`}
                      <button
                        className={styles.btnExcluir}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeleteModal(jogo.id);
                        }}
                        title="Excluir jogo"
                      >
                        ❌
                      </button>
                    </button>
                  );
                })                
            )}
          </div>

        </div>
      )}

      <JogosModal
        modalConfirmDelete={modalConfirmDelete}
        setModalConfirmDelete={setModalConfirmDelete}
        deleteJogo={deleteJogo}
        modalSuccess={modalSuccess}
        setModalSuccess={setModalSuccess}
        modalError={modalError}
        setModalError={setModalError}
      />
    </div>
  );
};

export default Resultados;
