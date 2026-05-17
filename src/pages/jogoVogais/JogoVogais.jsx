// ========================================
// JogoVogais.jsx
// ========================================

import React, { useEffect, useState } from "react";

import {
  DndContext,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { useLocation, useNavigate } from "react-router-dom";

import Timer from "@/components/timer/Timer";
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";

import { UsuarioStorage } from "@/helper/retornaUsuarioLogado";
import { InfoJogosService } from "@/services/infoJogos.service";
import { convertToSeconds } from "@/helper/formataTime";

import styles from "./JogoVogais.module.css";
import { useVogaisGame } from "@/components/jogos/vogais/core/useVogaisGame";
import VogaisGrid from "@/components/jogoVogais/numerosGrid/VogaisGrid";
import image from "@/assets/images/jacare-removebg.png";

export default function JogoVogais() {
  const navigate = useNavigate();

  const sensors = useSensors(useSensor(PointerSensor));

  const usuario = UsuarioStorage.get();

  const location = useLocation();

  const { difficulty } = location.state || {};

  const game = useVogaisGame(difficulty || "FACIL");

  const [time, setTime] = useState("03:00");

  const [timerActive, setTimerActive] = useState(true);

  const [loading, setLoading] = useState(false);

  const [completed, setCompleted] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    show: false,
  });

  const idDependente = Number(sessionStorage.getItem("playerId"));

  const handleTimeUpdate = (t) => setTime(t);

  useEffect(() => {
    if (game.isCompleted && !completed) {
      finalizar();
    }
  }, [game.isCompleted, completed]);

  async function finalizar() {
    setCompleted(true);

    setTimerActive(false);

    if (!usuario) {
      return finalizaDeslogado();
    }

    setLoading(true);

    try {
      await InfoJogosService.registrar({
        tempoTotal: convertToSeconds(time),

        totalTentativas: game.tentativas,

        totalAcertos: game.acertos,

        totalErros: game.erros,

        dependente: {
          id: idDependente,
        },
      });

      setModalConfig({
        show: true,

        title: "Missão concluída!",

        message: "Parabéns!",

        icon: "🏆",

        color: "#4caf50",

        doneButton: {
          label: "Voltar",

          onClick: () => navigate("/"),
        },

        onClose: () => navigate("/"),
      });
    } catch {
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
      setLoading(false);
    }
  }

  function finalizaDeslogado() {
    setModalConfig({
      show: true,

      title: "Missão concluída!",

      message: `
Acertos: ${game.acertos}
Erros: ${game.erros}
Tentativas: ${game.tentativas}
Tempo: ${time}
        `,

      icon: "🏆",

      color: "#4caf50",

      doneButton: {
        label: "Voltar",

        onClick: () => navigate("/"),
      },

      onClose: () => navigate("/"),
    });
  }

  console.log(game.droppedLetters);

  function DroppableArea() {
    const { setNodeRef } = useDroppable({
      id: "droppable-area",
    });

    return (
      <>
        <div ref={setNodeRef} className={styles.resultLetter}>
          <div className={styles.dropaArea}>
            {game.droppedLetters.map((letter) => (
              <div
                key={letter.id}
                id={"letter-" + letter.id}
                className={styles.letterInDroppable}
              >
                {letter.value}
              </div>
            ))}
          </div>
        </div>

        <img className={styles.bgImage} src={image} alt="" />
      </>
    );
  }

  return (
    <>
      <Timer isActive={timerActive} onTimeUpdate={handleTimeUpdate} />

      <div className={styles.bodyGame}>
        <div className={styles.game}>
          <div className={styles.gameContent}>
            <div className={styles.vogaisText}>
              <h1 className={styles.vogaisHeading}>{game.titulo}</h1>

              <p className={styles.vogaisParagraph}>{game.descricao}</p>
            </div>

            <DndContext sensors={sensors} onDragEnd={game.handleDragEnd}>
              <DroppableArea />

              <VogaisGrid letters={game.letters} />
            </DndContext>
          </div>
        </div>
      </div>

      {loading && (
        <CustomModal
          show
          title="Enviando dados..."
          message="Salvando progresso..."
          icon="⏳"
          color="#2196f3"
          hideButtons
        />
      )}

      <CustomModal show={modalConfig.show && !loading} {...modalConfig} />
    </>
  );
}
