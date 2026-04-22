import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./faceJogoVogais.module.css";
import image from "@/assets/images/jacare-removebg.png";

import {
  DndContext,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

import GameVogais from "../gameVogais/GameVogais.jsx";
import { randomizeArr } from "@/utils/utils";
import Timer from "@/components/timer/Timer";
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";
import { UsuarioStorage } from "@/helper/retornaUsuarioLogado";
import { InfoJogosService } from "@/services/infoJogos.service";
import { convertToSeconds } from "@/helper/formataTime";

function FaceJogoVogais() {
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));

  const usuario = UsuarioStorage.get();

  const [letters, setLetters] = useState([]);
  const [droppedLetters, setDroppedLetters] = useState([]);

  const [acertos, setAcertos] = useState(
    () => Number(sessionStorage.getItem("acertos")) || 0,
  );
  const [erros, setErros] = useState(
    () => Number(sessionStorage.getItem("erros")) || 0,
  );
  const [tentativas, setTentativas] = useState(0);

  const [time, setTime] = useState("03:00");
  const [timerActive, setTimerActive] = useState(true);

  const [jogoRegistrado, setJogoRegistrado] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalConfig, setModalConfig] = useState({ show: false });

  const idJogoVogais = 3;
  const idDependente = Number(sessionStorage.getItem("playerId"));

  const VOGAIS_IDS = [1, 5, 9, 15, 21];

  // init letters
  useEffect(() => {
    const base = Array.from({ length: 26 }, (_, i) => ({
      id: i + 1,
      value: i + 1,
    }));

    setLetters(randomizeArr(base));

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
    jogo: { id: idJogoVogais },
    dependente: { id: idDependente },
  };

  useEffect(() => {
    const finalizarJogo = async () => {
      if (droppedLetters.length === 5 && !jogoRegistrado) {
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
        } catch (err) {
          console.error(err);

          setLoading(false);

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
        }
      }
    };

    finalizarJogo();
  }, [droppedLetters, jogoRegistrado]);

  const { setNodeRef } = useDroppable({ id: "droppable-area" });

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

    const letter = letters.find((l) => l.id === active.id);
    if (!letter) return;

    const isVowel = VOGAIS_IDS.includes(letter.id);

    if (!droppedLetters.some((l) => l.id === letter.id) && isVowel) {
      setDroppedLetters((prev) => [...prev, letter]);
      setLetters((prev) => prev.filter((l) => l.id !== letter.id));

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

  const DroppableArea = () => {
    const { setNodeRef } = useDroppable({ id: "droppable-area" });

    return (
      <>
        <div ref={setNodeRef} className={styles.resultLetter}>
          <div className={styles.dropaArea}>
            {droppedLetters.map((letter) => (
              <div
                key={letter.id}
                id={"num" + letter.id}
                className={styles.letterInDroppable}
              >
                {String.fromCharCode(64 + letter.value)}
              </div>
            ))}
          </div>
        </div>
        <img className={styles.bgImage} src={image} alt="" />
      </>
    );
  };

  return (
    <>
      <Timer isActive={timerActive} onTimeUpdate={handleTimeUpdate} />

      <div className={styles.bodyGame}>
        <div className={styles.game}>
          <div className={styles.gameContent}>
            <div className={styles.vogaisText}>
              <h1 className={styles.vogaisHeading}>Jogo das Vogais</h1>
              <p className={styles.vogaisParagraph}>
                ARRASTE PARA CIMA APENAS AS LETRAS VOGAIS
              </p>
            </div>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <DroppableArea />
              <GameVogais letters={letters} />
            </DndContext>
          </div>
        </div>
      </div>

      {loading && (
        <CustomModal
          show
          title="Enviando dados..."
          message="Aguarde..."
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

export default FaceJogoVogais;
