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
  const dialog = useRef(Object.prototype.constructor(HTMLDialogElement));
  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [numbers, setNumbers] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index + 1, // Identificador único para cada número.
      value: index, // Valor numérico do número (1 = A, 2 = B, etc.).
    })),
  );
  const [droppedNumbers, setDroppedNumbers] = useState([]);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [tentativas, setTentativas] = useState(0);
  const [time, setTime] = useState("03:00"); // Estado para armazenar o tempo formatado
  const { registrarInfos } = useContext(JogoContext);
  const [infoJogoNumeros, setInfoJogoNumeros] = useState({});
  const { usuario } = useContext(AuthContext);
  const [modalConfig, setModalConfig] = useState({ show: false });
  const idJogoNumeros = 2;
  const idDependente = parseInt(sessionStorage.getItem("player"));
  const [jogoRegistrado, setJogoRegistrado] = useState(false);
  const [stateTimerAtivo, setStateTimerAtivo] = useState(true);

  useEffect(() => {
    if (usuario.token === "") {
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
  }, [usuario.token]);

  const token = usuario.token;

  useEffect(() => {
    const shuffledNumbers = randomizeArr([...numbers]);
    setNumbers(shuffledNumbers);
  }, []);

  const convertToMinutes = (time) => {
    // Divide o tempo em minutos e segundos
    const [minutes, seconds] = time.split(":").map(Number);

    // Converte tudo para minutos, incluindo os segundos
    return minutes + seconds / 60;
  };

  const handleTimeUpdate = (newTime) => {
    setTime(newTime); // Atualiza o estado com o novo tempo
  };


  async function registrarInfosJogo() {
    return await registrarInfos(infoJogoNumeros, token);
  }

  useEffect(() => {
    
    const executarAsync = async () => {
      const minutosConvertidos = convertToMinutes(time);
      const minutosArredondado = parseFloat(minutosConvertidos.toFixed(2));
      setInfoJogoNumeros({
        tempoTotal: minutosArredondado,
        tentativas: tentativas,
        acertos: acertos,
        erros: erros,
        infoJogos_id_fk: { id: idJogoNumeros },
        dependente: { id: idDependente },
      });

      if (droppedNumbers.length === 10 && !jogoRegistrado) {
        setJogoRegistrado(true);
        registrarInfosJogo().then((resultado) => {
          console.log(resultado);
          setStateTimerAtivo(false);
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
      }).catch((error) => {
          console.error("Erro ao registrar informações do jogo:", error);

          setModalConfig({
              show: true,
              title: "Erro",
              message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
              icon: "❌",
              color: "#f44336",
              doneButton: {
                  label: "Voltar",
                  onClick: () => navigate("/"),
              },
              onClose: () => navigate("/"),
          });
      });
      }
    };

    executarAsync();

  }, [droppedNumbers, navigate, time, tentativas, acertos, erros, idJogoNumeros, idDependente]);

  useEffect(() => {
    if (dialog.current?.open && !showPopup) {
      dialog.current?.close();
    } else if (!dialog.current?.open && showPopup) {
      dialog.current?.showModal();
    }
  }, [showPopup]);

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/");
  };

  const DroppableArea = () => {
    const { setNodeRef } = useDroppable({
      id: "droppable-area",
    });

    return (
      <div ref={setNodeRef} className={styles.dropContainer}>
        <div className={styles.droppedNumbers}>
          {droppedNumbers.map((number) => (
            <div
              key={number.id}
              id={number.id}
              className={styles.numberInDroppable}
            >
              {number.value}{" "}
              {/* Converte o valor numérico para a letra correspondente. */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    console.log(active, over)

    setTentativas((prev) => prev + 1);

    // Se o item não for solto sobre uma área válida, incremente erros.
    if (!over) {
      setErros((prev) => prev + 1);
      return;
    }

    const numberToDrop = numbers.find((number) => number.id === active.id);

    if (!numberToDrop) return;

    // Se há números anteriores ao número arrastado, incremente erros.
    const less = numbers.find((number) => number.value < numberToDrop.value);
    if (less) {
      setErros((prev) => prev + 1);
      return;
    }

    setDroppedNumbers((prev) => [...prev, numberToDrop]);
    setNumbers((prevNumbers) =>
      prevNumbers.filter((number) => number.id !== numberToDrop.id),
    );
    setAcertos((prev) => prev + 1);
    
  };

  return (
    <>
      <Timer
        isActive={stateTimerAtivo}
        resetTrigger={false}
        onTimeUpdate={handleTimeUpdate}
      />
      <div className={styles.gameWrapper}>
        <section className={styles.container}>
          <h1 className={styles.heading}>Jogo dos Números</h1>
          <p className={styles.paragraph}>
            Arraste os números para cima na sequência correta.
          </p>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <DroppableArea />
            <NumerosGrid numbers={numbers} />
          </DndContext>
        </section>

        <dialog ref={dialog} className={styles.popup}>
          <p>{popupMessage}</p>
          <button id="popup-close" onClick={handlePopupClose}>
            Voltar
          </button>
        </dialog>
      </div>

      <div className="enabled">
        <div className="active" vw-access-button></div>
        <div vw-plugin-wrapper>
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
      <script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
      <script>new window.VLibras.Widget('https://vlibras.gov.br/app');</script>
      <script
        src="https://website-widgets.pages.dev/dist/sienna.min.js"
        defer
      ></script>

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
