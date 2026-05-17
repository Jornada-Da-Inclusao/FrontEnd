import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import Timer from "@/components/timer/Timer";
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";

import { UsuarioStorage } from "@/helper/retornaUsuarioLogado";
import { InfoJogosService } from "@/services/infoJogos.service";

import { convertToSeconds } from "@/helper/formataTime";

import { IDS_JOGOS } from "@/utils/constants/jogos/ids";

import styles from "./JogoCores.module.css";
import { colorsGameFactory } from "@/components/jogos/cores/core/colorsFactory";
import { useColorsGame } from "@/components/jogos/cores/core/useColorsGame";

export default function JogoCores() {
  const navigate = useNavigate();

  const location = useLocation();

  const { difficulty } = location.state || {};

  const level = colorsGameFactory(difficulty || "FACIL");

  const game = useColorsGame(level);

  const sensors = useSensors(useSensor(PointerSensor));

  const usuario = UsuarioStorage.get();

  const idDependente = Number(sessionStorage.getItem("playerId"));

  const [time, setTime] = useState("03:00");

  const [timerActive, setTimerActive] = useState(true);

  const [loading, setLoading] = useState(false);

  const [stateIsCompleted, setStateIsCompleted] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    show: false,
  });

  function handleTimeUpdate(newTime) {
    setTime(newTime);
  }

  useEffect(() => {
    if (game.isCompleted && !stateIsCompleted) {
      finalizar();
    }
  }, [game.isCompleted, stateIsCompleted]);

  async function finalizar() {
    setStateIsCompleted(true);

    setTimerActive(false);

    if (!usuario) {
      return finalizarDeslogado();
    }

    setLoading(true);

    try {
      await InfoJogosService.registrar({
        tempoTotal: convertToSeconds(time),

        totalTentativas: game.tentativas,

        totalAcertos: game.acertos,

        totalErros: game.erros,

        jogo: {
          id: IDS_JOGOS[difficulty]?.CORES,
        },

        dependente: {
          id: idDependente,
        },
      });

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
    } catch (error) {
      console.error(error);

      setModalConfig({
        show: true,

        title: "Erro",

        message: "Ocorreu um erro inesperado.",

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

  function finalizarDeslogado() {
    const resultadoMessage = `
      Acertos: ${game.acertos}
      Erros: ${game.erros}
      Tentativas: ${game.tentativas}
      Tempo: ${time}
    `;

    setModalConfig({
      show: true,

      title: "Missão concluída!",

      message: resultadoMessage,

      icon: "🏆",

      color: "#4caf50",

      doneButton: {
        label: "Voltar",

        onClick: () => navigate("/"),
      },

      onClose: () => navigate("/"),
    });
  }

  return (
    <>
      <Timer isActive={timerActive} onTimeUpdate={handleTimeUpdate} />

      <div className={styles.gameBody}>
        <div className={styles.game}>
          <DndContext sensors={sensors} onDragEnd={game.handleDragEnd}>
            <section className={styles.infoArea}>
              <h1 className={styles.heading}>{game.title}</h1>

              <p className={styles.paragraph}>{game.description}</p>

              <div className={styles.colorArea}>
                {(game.draggables ?? []).map((draggable) => (
                  <div key={draggable.id}>
                    {draggable.label ?? draggable.value ?? draggable.id}
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.cardGrid}>
              {game.targets.map((target) => {
                const matched = game.matchedTargets.find(
                  (item) => item.targetId === target.id,
                );

                return (
                  <div key={target.id} className={styles.card}>
                    <img src={target.img} alt={target.name} />

                    <div className={styles.dropArea}>
                      {game.matchedTargets.some(
                        (m) => m.targetId === target.id,
                      ) ? (
                        <div className={styles.matchedBox} />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </section>
          </DndContext>
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
