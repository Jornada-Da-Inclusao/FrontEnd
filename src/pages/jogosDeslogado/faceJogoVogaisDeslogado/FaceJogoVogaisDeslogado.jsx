import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './faceJogoVogaisDeslogado.module.css';
import image from '@/assets/images/jacare-removebg.png'
import {
    DndContext,
    useDroppable,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import GameVogais from '../gameVogaisDeslogado/GameVogaisDeslogado.jsx';
import { randomizeArr } from '@/utils/utils';
import Timer from '@/components/timer/Timer';
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";

function FaceJogoVogaisDeslogado() {
    const dialog = useRef(Object.prototype.constructor(HTMLDialogElement));
    const navigate = useNavigate();
    const sensors = useSensors(useSensor(PointerSensor));
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [letters, setLetters] = useState(
        Array.from({ length: 26 }, (_, index) => ({
            id: index + 1,
            value: index + 1,
        }))
    );

    const [droppedLetters, setDroppedLetters] = useState([]);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [tentativas, setTentativas] = useState(0);
    const [time, setTime] = useState("03:00");
    const [modalConfig, setModalConfig] = useState({ show: false });
    const [isTimerActive, setIsTimerActive] = useState(true);  // Novo estado para controlar o timer

    useEffect(() => {
        const shuffledLetters = randomizeArr([...letters]);
        setLetters(shuffledLetters);
    }, []);

    const handleTimeUpdate = (newTime) => {
        setTime(newTime);
    };

    useEffect(() => {
        if (droppedLetters.length === 5) {
            const tempoFinal = time;
            // Quando o jogo terminar, exibe uma mensagem com o resultado
            const resultadoMessage = `
                Acertos: ${acertos}
                Erros: ${erros}
                Tentativas: ${tentativas}
                Tempo: ${tempoFinal}
                
                Para mais informações, por favor, faça login.
            `;
            setPopupMessage(resultadoMessage);
            setShowPopup(true);  // Exibe o popup com os resultados
            setIsTimerActive(false);  // Para o timer quando o jogo terminar
        }
    }, [droppedLetters, acertos, erros, tentativas, time]);

    useEffect(() => {
        if (dialog.current?.open && !showPopup) {
            dialog.current?.close();
        } else if (!dialog.current?.open && showPopup) {
            dialog.current?.showModal();
        }
    }, [showPopup]);

    const handlePopupClose = () => {
        setShowPopup(false);
        navigate("/login");  // Direciona para a página de cadastro quando o popup for fechado
    };

    const { setNodeRef } = useDroppable({
        id: "droppable-area",
    });

    const DroppableArea = () => {
        const { setNodeRef } = useDroppable({
            id: 'droppable-area',
        });

        return (
            <>
                <div ref={setNodeRef} className={styles.resultLetter}>
                    <div className={styles.dropaArea}>
                        {droppedLetters.map(letter => (
                            <div key={letter.id} id={"num" + letter.id} className={styles.letterInDroppable}>
                                {String.fromCharCode(64 + letter.value)}
                            </div>
                        ))}
                    </div>
                </div>
                <img className={styles.bgImage} src={image} alt="" />
            </>
        );
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        setTentativas((prev) => prev + 1);

        if (!over) {
            setErros((prev) => prev + 1);
            return;
        }

        const letterToDrop = letters.find(letter => letter.id === active.id);

        if (!letterToDrop) {
            return;
        }

        const ids = [1, 5, 9, 15, 21];

        if (!droppedLetters.some(letter => letter.id === letterToDrop.id) && ids.some(id => id === letterToDrop.id)) {
            setDroppedLetters(prev => [...prev, letterToDrop]);
            setLetters(prevLetters => prevLetters.filter(letter => letter.id !== letterToDrop.id));
            setAcertos((prev) => prev + 1);
            return;
        }
        setErros((prev) => prev + 1);
    };

    return (
        <>
            <Timer
                isActive={isTimerActive}  // Passa o estado do timer para o componente Timer
                resetTrigger={false}
                onTimeUpdate={handleTimeUpdate}
            />
            <div className={styles.bodyGame}>
                <div className={styles.game}>
                    <div className={styles.gameContent}>
                        <div className={styles.vogaisText}>
                            <h1 className={styles.vogaisHeading}>Jogo das Vogais</h1>
                            <p className={styles.vogaisParagraph}>ARRASTE PARA CIMA APENAS AS LETRAS VOGAIS</p>
                        </div>
                        <DndContext
                            sensors={sensors}
                            onDragEnd={handleDragEnd}
                        >
                            <DroppableArea />
                            <GameVogais letters={letters} />
                        </DndContext>
                    </div>
                </div>

                <dialog ref={dialog} className={styles.popup}>
                    <p>{popupMessage}</p>
                    <button id="popup-close" onClick={handlePopupClose}>
                        Login
                    </button>
                </dialog>
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
        </>
    );
}

export default FaceJogoVogaisDeslogado;
