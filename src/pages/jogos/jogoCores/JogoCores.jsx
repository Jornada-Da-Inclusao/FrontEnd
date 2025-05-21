import React, { useState, useEffect } from 'react';
import { animalsData, colorsData, stringsData } from '../../../components/jogoCores/Data.jsx'
import {
    DndContext,
    useDroppable,
    useSensor,
    useSensors,
    PointerSensor,
    closestCorners,
    useDraggable
} from '@dnd-kit/core'
import { CSS } from "@dnd-kit/utilities";
import { randomizeNum } from "@/utils/utils.js";
import styles from './jogoCores.module.css';
import { CustomModal } from "../../../components/Modal-custom-alert/CustomModal";
import Timer from '@/components/timer/Timer'; // <-- novo import

export default function JogoNumeros() {
    const [colors, setColors] = useState(
        Array.from({ length: colorsData.length }, (_, index) => ({
            id: index + 1,
            value: colorsData[index].code,
        }))
    );

    const [droppedColors, setDroppedColors] = useState([]);
    const [tentativas, setTentativas] = useState(0);
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);
    const [inicioJogo, setInicioJogo] = useState(null);
    const [fimJogo, setFimJogo] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [resetTimer, setResetTimer] = useState(0); // <-- novo estado
    const [timerAtivo, setTimerAtivo] = useState(true); // <-- novo estado
    const [tempoFormatado, setTempoFormatado] = useState(""); // <-- novo estado

    useEffect(() => {
        setInicioJogo(Date.now());
        setResetTimer(prev => prev + 1); // Reinicia o timer
    }, []);

    useEffect(() => {
        if (acertos === animalsData.length) {
            setFimJogo(Date.now());
            setTimerAtivo(false); // Para o timer
            setModalAberto(true);
        }
    }, [acertos]);

    const sensors = useSensors(useSensor(PointerSensor));

    const DroppableArea = (props) => {
        const { setNodeRef } = useDroppable({ id: props.id });

        return (
            <div key={props.id} id={props.id} ref={setNodeRef} className={styles.dropArea}>
                {props.children}
            </div>
        );
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const colorToDrop = colors.find(color => color.id === active.id);
        const expectedId = Number(over.id) - 1; // Convertendo para número

        if (colorToDrop) {
            setTentativas(prev => prev + 1);

            if (colorToDrop.id === expectedId) {
                setAcertos(prev => prev + 1);
                setDroppedColors(prev => [...prev, colorToDrop]);
                setColors(prevColors => prevColors.filter(color => color.id !== colorToDrop.id));
            } else {
                setErros(prev => prev + 1);
            }
        }
    };


    const Image = ({ animal }) => (
        <img src={animal.img} width={100} alt={animal.name} />
    );

    const Card = ({ animal }) => (
        <div className={styles.card}>
            <Image animal={animal} />
            <DroppableArea key={animal.id + 1} id={animal.id + 1}>
                {droppedColors.find(color => color.id === animal.id) && (
                    <ColorBox key={animal.id} id={animal.id} color={colorsData[animal.id]?.code} />
                )}
            </DroppableArea>
        </div>
    );

    const Cards = () => animalsData.map(element => (
        <Card key={element.id} animal={element} />
    ));

    const ColorBox = ({ id, color }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({ id });
        const dynamicStyles = { transform: CSS.Translate.toString(transform), transition };

        return (
            <div
                className={styles.square}
                id={id}
                ref={setNodeRef}
                style={{ backgroundColor: color, ...dynamicStyles }}
                {...attributes}
                {...listeners}
            />
        );
    };

    const Colors = () => colors.map(element => (
        <ColorBox key={element.id} id={element.id} color={element.value} />
    ));

    const Description = ({ animal, color, string }) => (
        <p className={styles.paragraph}>
            {animal.article} <b>{animal.name}</b> {string.body} {color.name}
        </p>
    );

    const Descriptions = () => animalsData.map(element => {
        const color = colorsData.at(element.id);
        const string = stringsData.at(element.id) || stringsData.at(randomizeNum(stringsData.length));

        return (
            <Description
                key={element.id}
                animal={element}
                color={color}
                string={string}
            />
        );
    });

    return (
        <>
            {/* Timer flutuante no topo direito */}
            <Timer
                isActive={timerAtivo}
                resetTrigger={resetTimer}
                onTimeUpdate={setTempoFormatado}
            />

            <div className={styles.gameBody}>
                <div className={styles.game}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
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
                </div>
            </div>

            <CustomModal
                isOpen={modalAberto}
                title="Missão concluída!"
                message={`Você acertou todos! 🎉\nTentativas: ${tentativas}\nErros: ${erros}\nTempo: ${tempoFormatado}`}
                onClose={() => setModalAberto(false)}
            />
        </>
    );
}
