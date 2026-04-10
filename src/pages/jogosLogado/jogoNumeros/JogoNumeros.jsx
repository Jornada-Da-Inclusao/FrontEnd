import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DndContext,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

import { JogoContext } from "@/contexts/JogoContext";
import { AuthContext } from "@/contexts/AuthContext";

import { randomizeArr } from "@/utils/utils.js";
import NumerosGrid from "@/components/jogoNumeros/numerosGrid/NumerosGrid.jsx";
import Timer from "@/components/timer/Timer.jsx";
import styles from "./JogoNumeros.module.css";
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";

export default function JogoNumeros() {
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));

  const { registrarInfos } = useContext(JogoContext);
  const { usuario } = useContext(AuthContext);

  const dialog = useRef(null);

  const [numbers, setNumbers] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      value: i,
    })),
  );

  const [droppedNumbers, setDroppedNumbers] = useState([]);

  const [acertos, setAcertos] = useState(
    () => Number(sessionStorage.getItem("acertos")) || 0,
  );
  const [erros, setErros] = useState(
    () => Number(sessionStorage.getItem("erros")) || 0,
  );
  const [tentativas, setTentativas] = useState(0);

  const [time, setTime] = useState("03:00");
  const [timerActive, setTimerActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [jogoRegistrado, setJogoRegistrado] = useState(false);

  const [modalConfig, setModalConfig] = useState({ show: false });

  const idJogoNumeros = 2;
  const idDependente = Number(sessionStorage.getItem("playerId"));

  useEffect(() => {
    sessionStorage.setItem("acertos", "0");
    sessionStorage.setItem("erros", "0");
    setAcertos(0);
    setErros(0);

    setNumbers((prev) => randomizeArr([...prev]));
  }, []);

  useEffect(() => {
    if (!usuario?.token) {
      setModalConfig({
        show: true,
        title: "Atenção",
        message: "Você precisa estar logado.",
        icon: "⚠️",
        color: "#ff9800",
        doneButton: {
          label: "OK",
          onClick: () => navigate("/"),
        },
        onClose: () => navigate("/"),
      });
    }
  }, [usuario, navigate]);

  const convertToMinutes = (t) => {
    const [m, s] = t.split(":").map(Number);
    return m + s / 60;
  };

  const handleTimeUpdate = (t) => setTime(t);

  const infoJogo = {
    tempoTotal: parseFloat(convertToMinutes(time).toFixed(2)),
    tentativas,
    acertos,
    erros,
    infoJogos_id_fk: { id: idJogoNumeros },
    dependente: { id: idDependente },
  };

  useEffect(() => {
    const finalizar = async () => {
      if (droppedNumbers.length === numbers.length && !jogoRegistrado) {
        setJogoRegistrado(true);
        setLoading(true);

        try {
          await registrarInfos(infoJogo);

          setTimerActive(false);

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
          console.error(err);

          setModalConfig({
            show: true,
            title: "Erro",
            message: "Ocorreu um erro ao salvar o jogo.",
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
    };

    finalizar();
  }, [droppedNumbers, acertos, erros, tentativas, time]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setTentativas((p) => p + 1);

    if (!over) {
      setErros((p) => {
        const v = p + 1;
        sessionStorage.setItem("erros", v);
        return v;
      });
      return;
    }

    const number = numbers.find((n) => n.id === active.id);
    if (!number) return;

    const hasSmaller = numbers.some((n) => n.value < number.value);

    if (hasSmaller) {
      setErros((p) => {
        const v = p + 1;
        sessionStorage.setItem("erros", v);
        return v;
      });
      return;
    }

    setDroppedNumbers((p) => [...p, number]);
    setNumbers((p) => p.filter((n) => n.id !== number.id));

    setAcertos((p) => {
      const v = p + 1;
      sessionStorage.setItem("acertos", v);
      return v;
    });
  };

  const DroppableArea = () => {
    const { setNodeRef } = useDroppable({ id: "droppable-area" });

    return (
      <div ref={setNodeRef} className={styles.dropContainer}>
        <div className={styles.droppedNumbers}>
          {droppedNumbers.map((n) => (
            <div key={n.id} className={styles.numberInDroppable}>
              {n.value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Timer isActive={timerActive} onTimeUpdate={handleTimeUpdate} />

      <div className={styles.gameWrapper}>
        <section className={styles.container}>
          <h1>Jogo dos Números</h1>
          <p>Arraste os números na sequência correta.</p>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <DroppableArea />
            <NumerosGrid numbers={numbers} />
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

      <CustomModal
        show={modalConfig.show && !loading}
        onClose={modalConfig.onClose}
        title={modalConfig.title}
        message={modalConfig.message}
        icon={modalConfig.icon}
        color={modalConfig.color}
        doneButton={modalConfig.doneButton}
      />
    </>
  );
}
