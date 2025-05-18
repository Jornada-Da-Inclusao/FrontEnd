import React, { useState, useEffect } from "react";
import styles from "../resultado/Resultados.module.css";
import { Switch, FormControlLabel } from "@mui/material";

// Componentes dos gráficos
import BarSizeChart from "../resultado/graficos/GraficoBarSize";
import GaugeChart from "../resultado/graficos/GraficoMedidor";
import RadarChart from "../resultado/graficos/GraficoRadar";
import { downloadExcelInfoJogos, downloadPdfInfoJogos } from "@/services/dependenteService";

// Serviços
import { fetchDependentes } from "../../../services/dependenteService";
import { getJogosPorDependente } from "../../../services/jogosService";

const Resultados = () => {
  const [dependentes, setDependentes] = useState([]);
  const [dependenteSelecionado, setDependenteSelecionado] = useState(""); // ID do dependente
  const [tipoGrafico, setTipoGrafico] = useState("bar");
  const [historicoJogos, setHistoricoJogos] = useState([]);
  const [jogoSelecionado, setJogoSelecionado] = useState(null); // Estado para armazenar o jogo selecionado
  const [mostrarUltimoJogo, setMostrarUltimoJogo] = useState(false); // Estado para controlar a visualização do último jogo

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
    if (dependenteSelecionado === "") {
      setHistoricoJogos([]);
      setJogoSelecionado(null); // Limpar o jogo selecionado ao desmarcar dependente
    } else {
      sessionStorage.setItem("idDependente", dependenteSelecionado);
      getJogosPorDependente(dependenteSelecionado).then((jogos) => {
        setHistoricoJogos(jogos);

        if (jogos.length > 0) {
          const ultimoJogo = jogos.sort((a, b) => new Date(b.createDate) - new Date(a.createDate))[0];
          if (!mostrarUltimoJogo) {
            setJogoSelecionado(ultimoJogo);
          }
        }
      });
    }
  }, [dependenteSelecionado, mostrarUltimoJogo]);

  const renderGrafico = () => {
    if (dependenteSelecionado === "" || !jogoSelecionado) {
      return <p>Selecione uma criança e um jogo para ver o desempenho.</p>;
    }

    console.log("Dados para o gráfico:", jogoSelecionado); // Verifique se os dados estão sendo passados corretamente

    // Função auxiliar para padronizar o nome
    const padronizarNomeJogo = (nomeOriginal) => {
      if (!nomeOriginal) return "Desconhecido";
      const nome = nomeOriginal.toLowerCase();

      if (nome.includes("mem")) return "Memória";
      if (nome.includes("num")) return "Números";
      if (nome.includes("let") || nome.includes("vogal")) return "Letras";
      if (nome.includes("cor")) return "Cores";
      return nomeOriginal; // fallback
    };

    const dadosGrafico = {
      acertos: jogoSelecionado.acertos,
      erros: jogoSelecionado.erros,
      tentativas: jogoSelecionado.tentativas,
      tempoTotal: jogoSelecionado.tempoTotal > 0 ? jogoSelecionado.tempoTotal : 1,
      jogo: padronizarNomeJogo(jogoSelecionado.infoJogos_id_fk?.nome), // adiciona o nome padronizado
    };

    switch (tipoGrafico) {
      case "bar":
        return <BarSizeChart dados={[dadosGrafico]} viewMode="individual" />;
      case "gauge":
        return <GaugeChart dados={[dadosGrafico]} viewMode="individual" />;
      case "radar":
        return <RadarChart dados={[dadosGrafico]} nome={obterNomeDependente()} />;
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
    if (isNaN(dataFormatada.getTime())) {
      // Se a data for inválida, retorne uma string de "Data inválida"
      return null;
    }
    return dataFormatada;
  };

  const selecionarJogo = (jogo) => {
    setJogoSelecionado(jogo); // Atualiza o estado com o jogo selecionado
    setMostrarUltimoJogo(false); // Desativa a visualização do último jogo ao selecionar um jogo específico
    console.log("Jogo selecionado:", jogo); // Verifica se o jogo selecionado é o correto
  };


  async function downloadPdf() {
    const idDependente = sessionStorage.getItem("idDependente");
    if (!idDependente) {
      console.error("ID do dependente não encontrado");
      return;
    }
    try {
      await downloadPdfInfoJogos(idDependente);
    } catch (error) {
      console.error("Erro ao gerar o PDF");
      console.error(error);
    }
  }

  async function downloadExcel() {
    const idDependente = sessionStorage.getItem("idDependente");
    if (!idDependente) {
      console.error("ID do dependente não encontrado");
      return;
    }
    try {
      await downloadExcelInfoJogos(idDependente);
    } catch (error) {
      console.error("Erro ao gerar o EXCEL");
      console.error(error);
    }
  }


  return (
    <div
      className={`${styles.container} ${dependenteSelecionado ? "" : styles.centralizado}`}
    >
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

          <label>
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
          </label>
        </section>

        {dependenteSelecionado && historicoJogos.length > 0 && (
          <section className={styles.textContent}>{renderGrafico()}</section>
        )}
      </div>

      {dependenteSelecionado && (
        <div className={styles.content}>
          <h2>Histórico de partidas:</h2>
          <div className={styles.buttons}>
            <button className={styles.relatory} onClick={downloadPdf}>Gerar PDF</button>
            <button className={styles.relatory} onClick={downloadExcel}>Gerar EXCEL</button>
          </div>
          <div className={styles.history}>
            {historicoJogos.length === 0 ? (
              <p>Carregando histórico...</p>
            ) : (
              historicoJogos.map((jogo, index) => {
                // Usamos a função para formatar a data
                const dataFormatada = formatarData(jogo.createDate); // Pode ser `updateDate` ou `createDate`
                const dataValida = dataFormatada !== null; // Verifica se a data é válida

                return (
                  <div
                    key={index}
                    className={`${styles.jogoItem} ${jogoSelecionado?.id === jogo.id && !mostrarUltimoJogo ? styles.ativo : ""}`}
                    onClick={() => selecionarJogo(jogo)} // Adiciona a função de clique
                  >
                    <p>
                      <strong>Jogo:</strong> {jogo.infoJogos_id_fk.nome}
                    </p>
                    <p>
                      <strong>Data:</strong>{" "}
                      {dataValida
                        ? `${dataFormatada.toLocaleDateString("pt-BR")} às ${dataFormatada.toLocaleTimeString("pt-BR")}`
                        : "Data inválida"}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Resultados;
