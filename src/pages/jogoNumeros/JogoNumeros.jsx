import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
} from "@dnd-kit/core";

import NumerosGrid from "@/components/jogoNumeros/numerosGrid/NumerosGrid.jsx";
import Timer from "@/components/timer/Timer.jsx";
import styles from "./JogoNumeros.module.css";

import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";
import { UsuarioStorage } from "@/helper/retornaUsuarioLogado";
import { InfoJogosService } from "@/services/infoJogos.service";
import { convertToSeconds } from "@/helper/formataTime";

import { useNumerosGame } from "@/components/jogos/numeros/core/useNumerosGame";

export default function JogoNumeros() {
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));

  const usuario = UsuarioStorage.get();
  const idDependente = Number(sessionStorage.getItem("playerId"));

  const location = useLocation();
  const { difficulty } = location.state || {};

  const game = useNumerosGame(difficulty || "FACIL");

  const [time, setTime] = useState("03:00");
  const [timerActive, setTimerActive] = useState(true);

  const [stateIsCompleted, setStateIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ show: false });

  const handleTimeUpdate = (t) => setTime(t);

  // 🧩 DROPPABLE AREA (VOLTOU AQUI)
  const DroppableArea = () => {
    const { setNodeRef } = useDroppable({ id: "droppable-area" });

    return (
      <div ref={setNodeRef} className={styles.dropContainer}>
        <div className={styles.droppedNumbers}>
          {game.droppedNumbers.map((n) => (
            <div key={n.id} className={styles.numberInDroppable}>
              {n.value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const finalizaDeslogado = () => {
    setTimerActive(false);
    const tempoFinal = time;
    const resultadoMessage = `
                      Acertos: ${game.acertos}
                      Erros: ${game.erros}
                      Tentativas: ${game.tentativas}
                      Tempo: ${tempoFinal}
                      
                      Para mais informações, por favor, faça login.
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
  };

  useEffect(() => {
    if (game.isCompleted && !stateIsCompleted) finalizar();
  }, [game]);

  async function finalizar() {
    setTimerActive(false);
    setStateIsCompleted(true);
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
        dependente: { id: idDependente },
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Timer isActive={timerActive} onTimeUpdate={handleTimeUpdate} />

      <div className={styles.gameWrapper}>
        <section className={styles.container}>
          <h1>{game?.titulo}</h1>
          <p>{game?.descricao}</p>

          <DndContext sensors={sensors} onDragEnd={game.handleDragEnd}>
            <DroppableArea />
            <NumerosGrid numbers={game.numbers} />
          </DndContext>
        </section>
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
