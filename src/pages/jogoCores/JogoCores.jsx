import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import Timer from "@/components/timer/Timer";
import { CustomModal } from "@/components/Modal-custom-alert/CustomModal";

import { UsuarioStorage } from "@/helper/retornaUsuarioLogado";
import { InfoJogosService } from "@/services/infoJogos.service";

import { convertToSeconds } from "@/helper/formataTime";

import { IDS_JOGOS } from "@/utils/constants/jogos/ids";

import styles from "./jogoCores.module.css";
import { useColorsGame } from "@/components/jogos/cores/core/useColorsGame";
import { descriptionTemplates } from "@/components/jogos/cores/data/strings.data";
import { colorBlocks } from "@/components/jogos/cores/data/colors.data";

export default function JogoCores() {
  const navigate = useNavigate();

  const location = useLocation();

  const { difficulty } = location.state || {};

  const selectedDifficulty = difficulty || sessionStorage.getItem("difficulty") || "FACIL";

  const game = useColorsGame(selectedDifficulty);

  const sensors = useSensors(useSensor(PointerSensor));

  const shapeLabels = {
    circle: "Círculo",
    square: "Quadrado",
    triangle: "Triângulo",
  };

  const DroppableArea = ({ id, children, accepts = [] }) => {
    const { setNodeRef } = useDroppable({ id, data: { accepts } });

    return (
      <div id={id} ref={setNodeRef} className={styles.dropArea}>
        {children}
      </div>
    );
  };

  const ColorBox = ({ draggable }) => {
    const id = draggable.id;
    const color = draggable.hex || draggable.color || draggable.value || draggable.code;
    const shape = draggable.shape;

    const { attributes, listeners, setNodeRef, transform, isDragging } =
      useDraggable({ id, data: { type: id } });

    const style = {
      transform: transform ? CSS.Translate.toString(transform) : undefined,
      willChange: "transform",
      zIndex: isDragging ? "var(--z-drag)" : undefined,
    };

    // Render an SVG for shapes, fallback to colored square
    const content = shape ? (
      <svg viewBox="0 0 100 100" className={styles.shapeSvg} aria-hidden>
        {shape === "circle" && (
          <circle
            cx="50"
            cy="50"
            r="30"
            fill={color}
            stroke="rgba(0, 0, 0, 0.35)"
            strokeWidth="4"
          />
        )}
        {shape === "square" && (
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            rx="8"
            ry="8"
            fill={color}
            stroke="rgba(0, 0, 0, 0.35)"
            strokeWidth="4"
          />
        )}
        {shape === "triangle" && (
          <polygon
            points="50,18 82,78 18,78"
            fill={color}
            stroke="rgba(0, 0, 0, 0.35)"
            strokeWidth="4"
          />
        )}
      </svg>
    ) : (
      <div style={{ backgroundColor: color, width: '100%', height: '100%', borderRadius: '0.5em' }} />
    );

    return (
      <div
        className={`${styles.square} ${isDragging ? styles.dragging : ""}`}
        id={id}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        {content}
      </div>
    );
  };

  const Colors = () =>
    (shuffledDraggables || []).map((draggable) => (
      <ColorBox key={draggable.id} draggable={draggable} />
    ));

  const Card = ({ target }) => (
    <div className={styles.card}>
      <img src={target.image} alt={target.label} width={100} />
      <DroppableArea id={target.id} accepts={[target.traits?.color]}>
        {(() => {
          const matched = game.matchedTargets.find((m) => m.targetId === target.id);
          if (!matched) return null;
          const item = matched.item || matched;
          const colorValue = item.hex || item.color || item.value || item.code;
          const bg = hexToRgba(colorValue, 0.65) || undefined;
          return <div className={styles.matchedBox} style={{ backgroundColor: bg }} />;
        })()}
      </DroppableArea>
    </div>
  );

  const Cards = () => (game.targets || []).map((t) => <Card key={t.id} target={t} />);

  // Randomize description templates once per game targets initialization
  const [templateMap, setTemplateMap] = useState([]);

  // Shuffle the color squares once per game draggables initialization
  const [shuffledDraggables, setShuffledDraggables] = useState([]);

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  useEffect(() => {
    const targets = game.targets || [];
    if (!targets.length) return;

    const map = targets.map(() => {
      const idx = Math.floor(Math.random() * descriptionTemplates.length);
      return descriptionTemplates[idx];
    });

    setTemplateMap(map);
  }, [game.targets?.length]);

  useEffect(() => {
    const items = game.draggables || [];
    if (!items.length) {
      setShuffledDraggables([]);
      return;
    }

    setShuffledDraggables((prev) => {
      // If length changed (new game) or previous is empty, reshuffle
      if (!prev || prev.length !== items.length) return shuffleArray(items);
      // Otherwise keep previous order but filter out removed items
      const filtered = prev.filter((p) => items.some((it) => it.id === p.id));
      // if filtered lost items, append missing items shuffled
      const missing = items.filter((it) => !filtered.some((f) => f.id === it.id));
      return [...filtered, ...shuffleArray(missing)];
    });
  }, [game.draggables?.length]);

  function hexToRgba(hex, alpha = 0.65) {
    if (!hex) return undefined;
    const h = hex.replace('#', '');
    const bigint = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const usuario = UsuarioStorage.get();

  const idDependente = Number(sessionStorage.getItem("playerId"));

  const [time, setTime] = useState("03:00");

  const [timerActive, setTimerActive] = useState(true);

  const [loading, setLoading] = useState(false);

  const [stateIsCompleted, setStateIsCompleted] = useState(false);

  const [modalConfig, setModalConfig] = useState({
    show: false,
  });

  function handleTimeUpdate(newTime) {
    setTime(newTime);
  }

  useEffect(() => {
    if (game.isCompleted && !stateIsCompleted) {
      finalizar();
    }
  }, [game.isCompleted, stateIsCompleted]);

  async function finalizar() {
    setStateIsCompleted(true);

    setTimerActive(false);

    if (!usuario) {
      return finalizarDeslogado();
    }

    setLoading(true);

    try {
      await InfoJogosService.registrar({
        tempoTotal: convertToSeconds(time),

        totalTentativas: game.tentativas,

        totalAcertos: game.acertos,

        totalErros: game.erros,

        jogo: {
          id: IDS_JOGOS[selectedDifficulty]?.CORES,
        },

        dependente: {
          id: idDependente,
        },
      });

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
    } finally {
      setLoading(false);
    }
  }

  function finalizarDeslogado() {
    const resultadoMessage = `
      Acertos: ${game.acertos}
      Erros: ${game.erros}
      Tentativas: ${game.tentativas}
      Tempo: ${time}
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
  }

  return (
    <>
      <Timer isActive={timerActive} onTimeUpdate={handleTimeUpdate} />

      <div className={styles.gameBody}>
        <div className={styles.game}>
          <DndContext sensors={sensors} onDragEnd={game.handleDragEnd}>
            <section className={styles.infoArea}>
              <h1 className={styles.heading}>{game.title}</h1>

              <p className={styles.paragraph}>{game.description}</p>

              <div className={styles.info}>
                {(game.targets || []).length ? (
                  <div>
                    {(game.targets || []).map((target, idx) => {
                      const colorId = target.traits?.color;
                      const color = colorBlocks.find((c) => c.id === colorId) || {};
                      const template = templateMap[idx] || descriptionTemplates[idx % descriptionTemplates.length];

                      return (
                        <p key={target.id} className={styles.paragraph}>
                          {target.article ? `${target.article} ` : ""}
                                              <b>{target.label ?? target.name ?? target.id}</b> {template} <b>{(target.traits?.shape && shapeLabels[target.traits.shape]) ? shapeLabels[target.traits.shape] + ' ' : ''}{color.label ?? color.name ?? colorId}</b>
                        </p>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className={styles.colorArea}>
                <Colors />
              </div>
            </section>

            <section className={styles.cardGrid}>
              <Cards />
            </section>
          </DndContext>
        </div>
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
