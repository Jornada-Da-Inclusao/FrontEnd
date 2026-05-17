import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import img1 from "@assets/images/memoria/pequena.png";
import img2 from "@assets/images/memoria/pequena3.png";
import img3 from "@assets/images/memoria/pequena4.png";
import img4 from "@assets/images/memoria/pequena5.png";
import img5 from "@assets/images/memoria/pequena2.png";
import img6 from "@assets/images/memoria/pequena6.png";
import imgPlaceholder from "@assets/images/memoria/rosa.png";

import styles from "./jogoMemoria.module.css";

import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";
import { UsuarioStorage } from "@/helper/retornaUsuarioLogado";
import { InfoJogosService } from "@/services/infoJogos.service";
import { convertToSeconds } from "@/helper/formataTime";

import Timer from "@/components/timer/Timer";
import { useMemoriaGame } from "@/components/jogos/memoria/core/useMemoriaGame";

const cardsData = [
  { id: "img1", name: "imagem1", img: img1 },
  { id: "img2", name: "imagem3", img: img2 },
  { id: "img3", name: "imagem4", img: img3 },
  { id: "img4", name: "imagem5", img: img4 },
  { id: "img1", name: "imagem1", img: img1 },
  { id: "img2", name: "imagem3", img: img2 },
  { id: "img3", name: "imagem4", img: img3 },
  { id: "img4", name: "imagem5", img: img4 },
  { id: "img6", name: "imagem6", img: img6 },
  { id: "img6", name: "imagem6", img: img6 },
  { id: "img5", name: "imagem7", img: img5 },
  { id: "img5", name: "imagem7", img: img5 },
];

const JogoMemoria = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { difficulty, gameId } = location.state || {};

  const usuario = UsuarioStorage.get();
  const idDependente = Number(sessionStorage.getItem("playerId"));

  const [time, setTime] = useState("03:00");
  const [timerActive, setTimerActive] = useState(true);

  const [loadingModal, setLoadingModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ show: false });

  const {
    cards,
    flipped,
    matched,
    flipCard,
    tentativas,
    acertos,
    erros,
    isCompleted,
  } = useMemoriaGame(difficulty, cardsData);

  const handleTimeUpdate = (t) => setTime(t);

  useEffect(() => {
    if (!isCompleted) return;

    const finalizar = async () => {
      setTimerActive(false);

      const payload = {
        tempoTotal: convertToSeconds(time),
        totalTentativas: tentativas,
        totalAcertos: acertos,
        totalErros: erros,
        jogo: { id: gameId },
        dependente: { id: idDependente },
      };

      if (!usuario) {
        setModalConfig({
          show: true,
          title: "Missão concluída!",
          message: `Acertos: ${acertos}
Erros: ${erros}
Tentativas: ${tentativas}
Tempo: ${time}

Para mais informações, faça login.`,
          icon: "🏆",
          color: "#4caf50",
          doneButton: {
            label: "Voltar",
            onClick: () => navigate("/"),
          },
          onClose: () => navigate("/"),
        });

        return;
      }

      try {
        setLoadingModal(true);

        await InfoJogosService.registrar(payload);

        setModalConfig({
          show: true,
          title: "Missão concluída!",
          message: "Parabéns! Você completou o jogo.",
          icon: "🏆",
          color: "#4caf50",
          doneButton: {
            label: "Voltar",
            onClick: () => navigate("/"),
          },
          onClose: () => navigate("/"),
        });
      } catch (err) {
        setModalConfig({
          show: true,
          title: "Erro",
          message: "Erro ao salvar progresso.",
          icon: "❌",
          color: "#f44336",
          doneButton: {
            label: "Voltar",
            onClick: () => navigate("/"),
          },
          onClose: () => navigate("/"),
        });
      } finally {
        setLoadingModal(false);
      }
    };

    finalizar();
  }, [isCompleted, time, tentativas, acertos, erros]);

  return (
    <>
      <Timer isActive={timerActive} onTimeUpdate={handleTimeUpdate} />

      <div className={styles.gameContainer}>
        <div className={styles.resultContainer}>
          <span className={styles.result}>
            Pares: {matched.length / 2}/{cards.length / 2}
          </span>
        </div>

        <div className={styles.board}>
          {cards.map((card, index) => (
            <img
              key={card.id + "-" + index}
              src={
                flipped.includes(index) || matched.includes(index)
                  ? card.img
                  : imgPlaceholder
              }
              onClick={() => flipCard(index)}
              className={`${styles.cardImage} ${
                matched.includes(index) ? styles.disabled : styles.cardHidden
              }`}
              alt={`card-${index}`}
            />
          ))}
        </div>
      </div>

      <CustomModal
        show={modalConfig.show}
        onClose={modalConfig.onClose}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        color={modalConfig.color}
        doneButton={modalConfig.doneButton}
      />

      {loadingModal && (
        <CustomModal
          show
          title="Enviando dados..."
          message="Aguarde um instante..."
          icon="⏳"
          color="#2196f3"
          doneButton={null}
          onClose={() => {}}
        />
      )}
    </>
  );
};

export default JogoMemoria;
