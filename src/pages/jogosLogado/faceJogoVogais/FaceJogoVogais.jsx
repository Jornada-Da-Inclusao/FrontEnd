import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './faceJogoVogais.module.css';
import image from '@/assets/images/jacare-removebg.png'
import {
    DndContext,
    useDroppable,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import { JogoContext } from "@/contexts/JogoContext";
import { AuthContext } from "@/contexts/AuthContext";
import GameVogais from '../gameVogais/GameVogais.jsx';
import { randomizeArr } from '@/utils/utils';
import Timer from '@/components/timer/Timer';
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";

function FaceJogoVogais() {
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
    const [acertos, setAcertos] = useState(() => Number(sessionStorage.getItem('acertos')) || 0);
    const [erros, setErros] = useState(() => Number(sessionStorage.getItem('erros')) || 0);
    const [tentativas, setTentativas] = useState(0);
    const [time, setTime] = useState("03:00");
    const idJogoVogais = 3;
    const idDependente = parseInt(sessionStorage.getItem("playerId"));
    const { registrarInfos } = useContext(JogoContext);
    const [infoJogoVogais, setInfoJogoVogais] = useState({});
    const { usuario } = useContext(AuthContext);
    const [modalConfig, setModalConfig] = useState({ show: false });
    const [jogoRegistrado, setJogoRegistrado] = useState(false);
    const [stateTimerAtivo, setStateTimerAtivo] = useState(true);

    // Estado para controlar modal de loading
    const [loading, setLoading] = useState(false);

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
    }, [usuario.token, navigate]);

    const token = usuario.token;

    useEffect(() => {
        const shuffledLetters = randomizeArr([...letters]);
        setLetters(shuffledLetters);
    }, []); // Só roda 1 vez no mount

    const convertToMinutes = (time) => {
        const [minutes, seconds] = time.split(":").map(Number);
        return minutes + seconds / 60;
    };

    const handleTimeUpdate = (newTime) => {
        setTime(newTime);
    };

    async function registrarInfosJogo() {
        return await registrarInfos(infoJogoVogais, token);
    }

    // Atualiza infoJogoVogais sempre que algo relevante muda
    useEffect(() => {
        const minutosConvertidos = convertToMinutes(time);
        const minutosArredondado = parseFloat(minutosConvertidos.toFixed(2));
        setInfoJogoVogais({
            tempoTotal: minutosArredondado,
            tentativas: tentativas,
            acertos: acertos,
            erros: erros,
            infoJogos_id_fk: { id: idJogoVogais },
            dependente: { id: idDependente },
        });
    }, [time, tentativas, acertos, erros, idJogoVogais, idDependente]);

    useEffect(() => {
        const executarAsync = async () => {
            if (droppedLetters.length === 5 && !jogoRegistrado) {
                setJogoRegistrado(true);
                setLoading(true);

                try {
                    const resultado = await registrarInfosJogo();
                    console.log(resultado);
                    setStateTimerAtivo(false);
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
                    console.error("Erro ao registrar informações do jogo:", error);
                    setLoading(false);
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
                }
            }
        };

        executarAsync();
    }, [droppedLetters, jogoRegistrado, navigate]);

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
            setErros(prev => {
                const novoValor = prev + 1;
                sessionStorage.setItem('erros', novoValor);
                return novoValor;
            });
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
            setAcertos(prev => {
                const novoValor = prev + 1;
                sessionStorage.setItem('acertos', novoValor);
                return novoValor;
            });
            return;
        }
        setErros(prev => {
            const novoValor = prev + 1;
            sessionStorage.setItem('erros', novoValor);
            return novoValor;
        });
    };

    return (
        <>
            <Timer
                isActive={stateTimerAtivo}
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
                        Voltar
                    </button>
                </dialog>
            </div>

            {/* Modal de Loading */}
            {loading && (
                <CustomModal
                    show={true}
                    title="Enviando dados..."
                    message="Aguarde um instante, estamos salvando seu progresso."
                    icon="⏳"
                    color="#2196f3"
                    hideButtons={true} // Se CustomModal suportar isso, oculta botões
                // onClose omitido para evitar fechar durante loading
                />
            )}

            <CustomModal
                show={modalConfig.show && !loading} // Modal sucesso/erro só aparece quando não estiver loading
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
