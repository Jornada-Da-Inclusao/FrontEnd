import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  animalsData,
  colorsData,
  stringsData,
} from "../../../components/jogoCores/Data.jsx";

import {
  DndContext,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  useDraggable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";
import { JogoContext } from "@/contexts/JogoContext";
import { AuthContext } from "@/contexts/AuthContext";
import { randomizeArr } from "@/utils/utils.js";
import Timer from "@/components/timer/Timer.jsx";
import styles from "./jogoCores.module.css";
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal.jsx";

export default function JogoCores() {
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));

  const { registrarInfos } = useContext(JogoContext);
  const { usuario } = useContext(AuthContext);

  const dialog = useRef(null);

  const [colors, setColors] = useState(
    colorsData.map((c, index) => ({
      id: index,
      value: c.code,
    })),
  );

  const [droppedColors, setDroppedColors] = useState([]);

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

  const idJogoCores = 4;
  const idDependente = Number(sessionStorage.getItem("playerId"));

  useEffect(() => {
    sessionStorage.setItem("acertos", "0");
    sessionStorage.setItem("erros", "0");
    setAcertos(0);
    setErros(0);
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

  const handleTimeUpdate = (newTime) => setTime(newTime);

  const infoJogo = {
    tempoTotal: parseFloat(convertToMinutes(time).toFixed(2)),
    tentativas,
    acertos,
    erros,
    infoJogos_id_fk: { id: idJogoCores },
    dependente: { id: idDependente },
  };

  useEffect(() => {
    const finalizar = async () => {
      if (droppedColors.length === colorsData.length && !jogoRegistrado) {
        setJogoRegistrado(true);
        setLoading(true);

        try {
          await registrarInfos(infoJogo);

          setTimerActive(false);
          setLoading(false);

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

          setLoading(false);

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
        }
      }
    };

    finalizar();
  }, [droppedColors, acertos, erros, tentativas, time]);

  const { setNodeRef } = useDroppable({ id: "root" });

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setTentativas((prev) => prev + 1);

    if (!over) {
      setErros((prev) => {
        const v = prev + 1;
        sessionStorage.setItem("erros", v);
        return v;
      });
      return;
    }

    const color = colorsData.find((c) => c.id === active.id);
    if (!color) return;

    const animalId = over.id;
    const correct = color.id === animalId;

    if (correct && !droppedColors.some((c) => c.id === color.id)) {
      setDroppedColors((prev) => [...prev, color]);
      setColors((prev) => prev.filter((c) => c.id !== color.id));

      setAcertos((prev) => {
        const v = prev + 1;
        sessionStorage.setItem("acertos", v);
        return v;
      });
      return;
    }

    setErros((prev) => {
      const v = prev + 1;
      sessionStorage.setItem("erros", v);
      return v;
    });
  };

  const DroppableArea = ({ id, children }) => {
    const { setNodeRef } = useDroppable({
      id,
    });

    return (
      <div ref={setNodeRef} className={styles.dropArea}>
        {children}
      </div>
    );
  };

  const ColorBox = ({ id, color }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useDraggable({
        id,
      });

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={styles.square}
        style={{
          backgroundColor: color,
          transform: CSS.Translate.toString(transform),
          transition,
        }}
      />
    );
  };

  const Cards = () =>
    animalsData.map((animal) => (
      <div key={animal.id} className={styles.card}>
        <img src={animal.img} width={100} alt={animal.name} />

        <DroppableArea id={animal.id}>
          {droppedColors.find((c) => c.id === animal.id) && (
            <ColorBox id={animal.id} color={colorsData[animal.id].code} />
          )}
        </DroppableArea>
      </div>
    ));

  const Colors = () =>
    colors.map((c) => <ColorBox key={c.id} id={c.id} color={c.value} />);

  return (
    <>
      <Timer isActive={timerActive} onTimeUpdate={handleTimeUpdate} />

      <div className={styles.gameBody}>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className={styles.infoArea}>
            <h1>Jogo das Cores</h1>
            <p>Arraste as cores para os animais corretos</p>

            <div className={styles.colorArea}>
              <Colors />
            </div>
          </div>

          <div className={styles.cardGrid}>
            <Cards />
          </div>
        </DndContext>
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
