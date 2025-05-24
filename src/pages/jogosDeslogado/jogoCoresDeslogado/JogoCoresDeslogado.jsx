import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { animalsData, colorsData, stringsData } from '../../../components/jogoCores/Data.jsx'
import {
    DndContext,
    useDroppable,
    useSensor,
    useSensors,
    PointerSensor,
    useDraggable
} from '@dnd-kit/core'
import { CSS } from "@dnd-kit/utilities";
import { JogoContext } from "@/contexts/JogoContext";
import { AuthContext } from "@/contexts/AuthContext";
import { randomizeArr } from "@/utils/utils.js";
import NumerosGrid from "@/components/jogoNumeros/numerosGrid/NumerosGrid.jsx";
import Timer from "@/components/timer/Timer.jsx";
import styles from './jogoCoresDeslogado.module.css'
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal.jsx";

export default function JogoNumerosDeslogado() {
    const animals = [...animalsData];
    const [colors, setColors] = useState(Array.from({ length: colorsData.length }, (_, index) => ({
        id: index,
        value: colorsData[index].code
    })));
    const descriptions = [...stringsData];
    const [droppedColors, setDroppedColors] = useState([]);
    const dialog = useRef(Object.prototype.constructor(HTMLDialogElement));
    const navigate = useNavigate();
    const sensors = useSensors(useSensor(PointerSensor));
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [tentativas, setTentativas] = useState(0);
    const [time, setTime] = useState("03:00"); // Estado para armazenar o tempo formatado
    const [modalConfig, setModalConfig] = useState({ show: false });
    const [isTimerActive, setIsTimerActive] = useState(true);  // Novo estado para controlar o timer


    const handleTimeUpdate = (newTime) => {
        setTime(newTime); // Atualiza o estado com o novo tempo
    };


    useEffect(() => {
        if (droppedColors.length === 6) {
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
    }, [droppedColors, tentativas, acertos, erros, navigate]);

    useEffect(() => {
        if (dialog.current?.open && !showPopup) {
            dialog.current?.close();
        } else if (!dialog.current?.open && showPopup) {
            dialog.current?.showModal();
        }
    }, [showPopup]);

    const handlePopupClose = () => {
        setShowPopup(false);
        navigate("/login");
    };

    const DroppableArea = (props) => {
        const { setNodeRef } = useDroppable({
            id: props.id,
            data: {
                accepts: [props.id]
            }
        });

        return (
            <div key={props.id} id={props.id} ref={setNodeRef} className={styles.dropArea}>
                {props.children}
            </div>
        )
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;

        setTentativas((prev) => prev + 1);

        if (over && over.data.current.accepts.includes(active.data.current.type)) {
            const colorToDrop = colorsData.find(color => color.id === active.id);

            setDroppedColors(prev => [...prev, colorToDrop]);
            setColors(prevColors => prevColors.filter(color => color.id !== colorToDrop.id));
            setAcertos((prev) => prev + 1);
            return;
        }

        setErros((prev) => prev + 1);
    }

    const Image = ({ animal }) => {
        return (
            <img
                src={animal.img}
                width={100}
                alt={animal.name}
            />
        )
    }

    const Card = ({ animal }) => {
        return (
            <div className={styles.card}>
                <Image animal={animal} />
                <DroppableArea key={animal.id} id={animal.id}>
                    {droppedColors.find(color => color.id === animal.id) ? (
                        <ColorBox key={colorsData[animal.id].id} id={colorsData[animal.id].id} color={colorsData[animal.id].code} />
                    ) : (null)}
                </DroppableArea>
            </div>
        )
    }

    const Cards = () => {
        const cards = animals.map(element =>
            <Card key={element.id} animal={element} />
        );

        return cards;
    }

    const ColorBox = ({ id, color }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({
            id: id,
            data: {
                type: id
            }
        });

        const staticStyles = {
            willChange: 'transform',
        };

        const dynamicStyles = {
            transform: CSS.Translate.toString(transform),
            transition,
        };

        return (
            <div
                className={styles.square}
                id={id}
                ref={setNodeRef}
                style={{
                    backgroundColor: color,
                    ...staticStyles,
                    ...dynamicStyles
                }}
                {...attributes}
                {...listeners}
            >
            </div>
        )
    }

    const Colors = () => {
        const colorsArr = colors.map(element =>
            <ColorBox key={element.id} id={element.id} color={element.value} />
        );

        return colorsArr;
    }

    const Description = ({ animal, color, string }) => {
        return <p className={styles.paragraph}>{animal.article} <b>{animal.name}</b> {string.body} {color.name}</p>
    }

    const Descriptions = () => {
        const descs = animals.map((element) => {
            const color = colorsData[element.id];
            const desc = stringsData[element.id];
            return (
                <Description
                    key={element.id}
                    animal={element}
                    color={color}
                    string={desc}
                />
            )
        })

        return descs;
    }

    return (
        <>
            <Timer
                isActive={isTimerActive}
                resetTrigger={false}
                onTimeUpdate={handleTimeUpdate}
            />
            <div className={styles.gameBody}>
                <div className={styles.game}>
                    <DndContext
                        sensors={sensors}
                        onDragEnd={handleDragEnd}
                    >
                        <div className={styles.infoArea}>
                            <h1 className={styles.heading}>Jogo das Cores</h1>
                            <p className={styles.paragraph}>Arraste as cores para seus respectivos animais.</p>
                            <div className={styles.info}>
                                <Descriptions />
                                <p className={styles.paragraph}>Coloque a cor favorita em cada bichinho.</p>
                            </div>
                            <div className={styles.colorArea}>
                                <Colors />
                            </div>
                        </div>
                        <div className={styles.cardGrid}>
                            <Cards />
                        </div>
                    </DndContext>
                    <dialog ref={dialog} className={styles.popup}>
                        <p>{popupMessage}</p>
                        <button id="popup-close" onClick={handlePopupClose}>
                            Login
                        </button>
                    </dialog>
                </div>
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