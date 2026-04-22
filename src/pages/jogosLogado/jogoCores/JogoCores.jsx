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
import Timer from "@/components/timer/Timer.jsx";
import styles from "./jogoCores.module.css";
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal.jsx";
import { UsuarioStorage } from "@/helper/retornaUsuarioLogado.js";
import { InfoJogosService } from "@/services/infoJogos.service.js";
import { convertToSeconds } from "@/helper/formataTime.js";

export default function JogoCores() {
  const navigate = useNavigate();
  const animals = [...animalsData];
  const [colors, setColors] = useState(
    Array.from({ length: colorsData.length }, (_, index) => ({
      id: index,
      value: colorsData[index].code,
    })),
  );
  const sensors = useSensors(useSensor(PointerSensor));

  const usuario = UsuarioStorage.get();

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

  function chamaRotinaDeslogado() {
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

  // redirect if not logged
  useEffect(() => {
    if (!usuario?.id && !modalConfig.show) return chamaRotinaDeslogado();
  }, [usuario, navigate]);

  const handleTimeUpdate = (newTime) => setTime(newTime);

  const infoJogo = {
    tempoTotal: convertToSeconds(time),
    totalTentativas: tentativas,
    totalAcertos: acertos,
    totalErros: erros,
    jogo: { id: idJogoCores },
    dependente: { id: idDependente },
  };

  useEffect(() => {
    const finalizar = async () => {
      if (droppedColors.length === colorsData.length && !jogoRegistrado) {
        setJogoRegistrado(true);
        setLoading(true);

        try {
          await InfoJogosService.registrar(infoJogo);

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

  const DroppableArea = ({ id, children }) => {
    const { setNodeRef } = useDroppable({
      id,
      data: { accepts: [id] },
    });

    return (
      <div id={id} ref={setNodeRef} className={styles.dropArea}>
        {children}
      </div>
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setTentativas((prev) => prev + 1);

    if (over && over.data.current.accepts.includes(active.data.current.type)) {
      const colorToDrop = colorsData.find((color) => color.id === active.id);
      setDroppedColors((prev) => [...prev, colorToDrop]);
      setColors((prevColors) =>
        prevColors.filter((color) => color.id !== colorToDrop.id),
      );
      setAcertos((prev) => {
        const novoValor = prev + 1;
        sessionStorage.setItem("acertos", novoValor);
        return novoValor;
      });
    } else {
      setErros((prev) => {
        const novoValor = prev + 1;
        sessionStorage.setItem("erros", novoValor);
        return novoValor;
      });
    }
  };

  const Image = ({ animal }) => (
    <img src={animal.img} width={100} alt={animal.name} />
  );

  const Card = ({ animal }) => (
    <div className={styles.card}>
      <Image animal={animal} />
      <DroppableArea id={animal.id}>
        {droppedColors.find((color) => color.id === animal.id) ? (
          <ColorBox
            id={colorsData[animal.id].id}
            color={colorsData[animal.id].code}
          />
        ) : null}
      </DroppableArea>
    </div>
  );

  const Cards = () =>
    animals.map((animal) => <Card key={animal.id} animal={animal} />);

  const ColorBox = ({ id, color }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useDraggable({
        id,
        data: { type: id },
      });

    return (
      <div
        className={styles.square}
        id={id}
        ref={setNodeRef}
        style={{
          backgroundColor: color,
          transform: CSS.Translate.toString(transform),
          transition,
          willChange: "transform",
        }}
        {...attributes}
        {...listeners}
      />
    );
  };

  const Colors = () =>
    colors.map((color) => (
      <ColorBox key={color.id} id={color.id} color={color.value} />
    ));

  const Description = ({ animal, color, string }) => (
    <p className={styles.paragraph}>
      {animal.article} <b>{animal.name}</b> {string.body} {color.name}
    </p>
  );

  const Descriptions = () =>
    animals.map((animal) => {
      const color = colorsData[animal.id];
      const string = stringsData[animal.id];
      return (
        <Description
          key={animal.id}
          animal={animal}
          color={color}
          string={string}
        />
      );
    });

  return (
    <>
      <Timer
        isActive={timerActive}
        resetTrigger={false}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className={styles.gameBody}>
        <div className={styles.game}>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className={styles.infoArea}>
              <h1 className={styles.heading}>Jogo das Cores</h1>
              <p className={styles.paragraph}>
                Arraste as cores para seus respectivos animais.
              </p>
              <div className={styles.info}>
                <Descriptions />
                <p className={styles.paragraph}>
                  Coloque a cor favorita em cada bichinho.
                </p>
              </div>
              <div className={styles.colorArea}>
                <Colors />
              </div>
            </div>
            <div className={styles.cardGrid}>
              <Cards />
            </div>
          </DndContext>
        </div>
      </div>

      {/* Modal de loading - fica sempre visível enquanto loadingModal for true */}
      {loading && (
        <CustomModal
          show={true}
          title="Enviando dados..."
          message="Aguarde um instante, estamos salvando seu progresso."
          icon="⏳"
          color="#2196f3"
          hideButtons={true} // se seu CustomModal suportar bloquear o fechamento
          // onClose={() => {}} // opcional: não permitir fechar enquanto carregando
        />
      )}

      <CustomModal
        show={modalConfig.show}
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
