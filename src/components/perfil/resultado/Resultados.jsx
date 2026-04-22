import React, { useState, useEffect } from "react";
import styles from "../resultado/Resultados.module.css";
import { Switch, FormControlLabel } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";

import BarSizeChart from "../resultado/graficos/GraficoBarSize";
import GaugeChart from "../resultado/graficos/GraficoMedidor";
import RadarChart from "../resultado/graficos/GraficoRadar";

import { DependenteService } from "../../../services/dependente.service";
import { InfoJogosService } from "../../../services/infoJogos.service";

import { JogosModal } from "../../Modal-custom-alert/JogosModal";
import { JogosService } from "@/services/jogos.service";
import { UsuarioStorage } from "@/helper/retornaUsuarioLogado";

const Resultados = () => {
  const [dependentes, setDependentes] = useState([]);
  const [dependenteSelecionado, setDependenteSelecionado] = useState("");
  const [tipoGrafico, setTipoGrafico] = useState("bar");

  const [historicoJogos, setHistoricoJogos] = useState([]);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);

  const [mostrarUltimoJogo, setMostrarUltimoJogo] = useState(true);
  const [jogosPorTipo, setJogosPorTipo] = useState([]);

  const [jogadaSelecionada, setJogadaSelecionada] = useState(null);

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);

  // =========================
  // LOAD DEPENDENTES
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        const idUsuario = UsuarioStorage.getId();
        const data =
          (await DependenteService.buscarPorUsuario?.(idUsuario)) || [];
        setDependentes(data);
      } catch (err) {
        console.error("Erro ao buscar dependentes:", err);
      }
    };

    load();
  }, []);

  // =========================
  // LOAD JOGOS
  // =========================
  useEffect(() => {
    if (!dependenteSelecionado) {
      setHistoricoJogos([]);
      setJogoSelecionado(null);
      setJogosPorTipo([]);
      return;
    }

    sessionStorage.setItem("idDependente", dependenteSelecionado);

    const loadJogos = async () => {
      try {
        const jogos = await InfoJogosService.getByDependenteId(
          dependenteSelecionado,
        );

        setHistoricoJogos(jogos);

        if (jogos.length === 0) return;

        const ordenados = [...jogos].sort(
          (a, b) => new Date(b.createDate) - new Date(a.createDate),
        );

        if (mostrarUltimoJogo) {
          const tiposUnicos = {};
          const ultimosPorTipo = [];

          for (const jogo of ordenados) {
            const nome = jogo.nomeJogo?.toLowerCase() || "";
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
      } catch (err) {
        console.error("Erro ao carregar jogos:", err);
      }
    };

    loadJogos();
  }, [dependenteSelecionado, mostrarUltimoJogo]);

  // =========================
  // HELPERS
  // =========================
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

  const obterNomeDependente = () => {
    const dep = dependentes.find((d) => d.id === Number(dependenteSelecionado));
    return dep?.nome || "";
  };

  const formatarData = (data) => {
    const d = new Date(data);
    if (isNaN(d.getTime())) return null;
    d.setHours(d.getHours() - 3);
    return d;
  };

  // =========================
  // DOWNLOADS (SERVICE)
  // =========================
  const downloadPdf = async () => {
    if (!dependenteSelecionado) return;

    setIsLoadingPdf(true);

    try {
      await DependenteService.downloadPdf(dependenteSelecionado);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const downloadExcel = async () => {
    if (!dependenteSelecionado) return;

    setIsLoadingExcel(true);

    try {
      await DependenteService.downloadExcel(dependenteSelecionado);
    } catch (err) {
      console.error("Erro ao gerar Excel:", err);
    } finally {
      setIsLoadingExcel(false);
    }
  };

  // =========================
  // DELETE (SERVICE)
  // =========================
  const deleteJogo = async () => {
    if (!jogadaSelecionada) return;

    try {
      // await InfoJogosService.deletar(jogadaSelecionada);

      setModalConfirmDelete(false);
      setModalSuccess(true);

      const jogos = await JogosService.getPorDependente(dependenteSelecionado);
      setHistoricoJogos(jogos);
    } catch (err) {
      console.error("Erro ao excluir jogo:", err);
      setModalConfirmDelete(false);
      setModalError(true);
    }
  };

  const handleOpenDeleteModal = (id) => {
    setJogadaSelecionada(id);
    setModalConfirmDelete(true);
  };

  const selecionarJogo = (jogo) => {
    setJogoSelecionado(jogo);
    setMostrarUltimoJogo(false);
  };

  // =========================
  // RENDER GRAFICO
  // =========================
  const renderGrafico = () => {
    if (
      dependenteSelecionado === "" ||
      (!jogoSelecionado && !mostrarUltimoJogo)
    ) {
      return <p>Selecione uma criança e um jogo.</p>;
    }

    const dados = mostrarUltimoJogo
      ? jogosPorTipo.map((jogo) => ({
          totalAcertos: jogo.totalAcertos,
          totalErros: jogo.totalErros,
          totalTentativas: jogo.totalTentativas,
          tempoTotal: jogo.tempoTotal > 0 ? jogo.tempoTotal : 1,
          jogo: padronizarNomeJogo(jogo.nomeJogo),
        }))
      : [
          {
            totalAcertos: jogoSelecionado.totalAcertos,
            totalErros: jogoSelecionado.totalErros,
            totalTentativas: jogoSelecionado.totalTentativas,
            tempoTotal:
              jogoSelecionado.tempoTotal > 0 ? jogoSelecionado.tempoTotal : 1,
            jogo: padronizarNomeJogo(jogoSelecionado.nomeJogo),
          },
        ];

    switch (tipoGrafico) {
      case "bar":
        return <BarSizeChart dados={dados} viewMode="individual" />;
      case "gauge":
        return <GaugeChart dados={dados} viewMode="individual" />;
      case "radar":
        return <RadarChart dados={dados} nome={obterNomeDependente()} />;
      default:
        return null;
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div
      className={`${styles.container} ${
        dependenteSelecionado ? "" : styles.centralizado
      }`}
    >
      <div className={styles.topSection}>
        <h2>Resultados dos Jogos</h2>

        <section className={styles.filter}>
          <div className={styles.selectGroup}>
            <label>Escolha a criança:</label>
            <select
              value={dependenteSelecionado}
              onChange={(e) => setDependenteSelecionado(e.target.value)}
            >
              <option value="">Selecione</option>
              {dependentes.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectGroup}>
            <label>Visualização:</label>
            <select
              value={tipoGrafico}
              onChange={(e) => setTipoGrafico(e.target.value)}
            >
              <option value="bar">Tentativas, Acertos e Erros</option>
              <option value="gauge">Tempo</option>
              <option value="radar">Habilidades</option>
            </select>
          </div>
        </section>
      </div>

      <div className={styles.bottomSection}>
        <FormControlLabel
          control={
            <Switch
              checked={mostrarUltimoJogo}
              onChange={() => setMostrarUltimoJogo((v) => !v)}
            />
          }
          label="Mostrar último resultado por jogo"
        />

        {dependenteSelecionado && historicoJogos.length > 0 && (
          <section className={styles.textContent}>{renderGrafico()}</section>
        )}

        {dependenteSelecionado && (
          <div className={styles.historySection}>
            <div className={styles.headerTop}>
              <h2>Histórico</h2>

              <div className={styles.buttons}>
                <button onClick={downloadPdf}>
                  {isLoadingPdf ? "Gerando..." : "PDF"}
                </button>

                <button onClick={downloadExcel}>
                  {isLoadingExcel ? "Gerando..." : "Excel"}
                </button>
              </div>
            </div>

            <div className={styles.history}>
              {historicoJogos.length === 0 ? (
                <p>Carregando...</p>
              ) : (
                historicoJogos
                  .sort(
                    (a, b) => new Date(b.createDate) - new Date(a.createDate),
                  )
                  .map((jogo) => {
                    const data = formatarData(jogo.createDate);

                    return (
                      <button
                        key={jogo.id}
                        className={styles.btnHistory}
                        onClick={() => selecionarJogo(jogo)}
                      >
                        {jogo.nomeJogo} - {data?.toLocaleDateString()}{" "}
                        {data?.toLocaleTimeString()}
                        <button
                          className={styles.btnExcluir}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDeleteModal(jogo.id);
                          }}
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
      </div>

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
