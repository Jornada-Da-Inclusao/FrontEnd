import { useEffect, useMemo, useState } from "react";
import { scoreStore } from "../../scoreStore/scoreStore";
import { colorsGameFactory } from "./colorsFactory";

export function useColorsGame(difficulty) {
  const [rules] = useState(() => {
    const r = colorsGameFactory(difficulty);

    return r;
  });

  const [items, setItems] = useState([]);
  const [targets, setTargets] = useState([]);
  const [matchedTargets, setMatchedTargets] = useState([]);

  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [tentativas, setTentativas] = useState(0);

  const [gameData, setGameData] = useState(null);

  // 🔥 sync score global
  useEffect(() => {
    scoreStore.set({ acertos, erros });
  }, [acertos, erros]);

  // INIT GAME
  useEffect(() => {
    const data = rules.createGame ? rules.createGame() : rules.setup ? rules.setup() : {};

    setTargets(data.targets || []);
    setItems(data.draggables || data.items || []);

    setGameData(data);

    setMatchedTargets([]);

    setAcertos(0);
    setErros(0);
    setTentativas(0);

    scoreStore.set({ acertos: 0, erros: 0 });
  }, [rules]);

  function handleDragEnd(event) {
    const { active, over } = event;

    setTentativas((p) => p + 1);

    if (!over) {
      setErros((p) => p + 1);
      return;
    }

    const item = items.find((i) => i.id === active.id);
    const target = targets.find((t) => t.id === over.id);

    if (!item || !target) {
      setErros((p) => p + 1);
      return;
    }

    const isValid = rules.validateMove({
      item,
      target,
      items,
      matchedTargets,
      gameData,
    });

    if (isValid) {
      setMatchedTargets((prev) => [
        ...prev,
        {
          targetId: target.id,
          item,
        },
      ]);

      setItems((prev) => prev.filter((i) => i.id !== item.id));

      setAcertos((p) => p + 1);

      return;
    }

    setErros((p) => p + 1);
  }

  console.log()
  const isCompleted = rules.isCompleted({ matchedTargets, targets });
  return {
    title: rules.title,
    description: rules.getDescription
      ? rules.getDescription(gameData)
      : rules.description,

    draggables: items || [],
    targets: targets || [],

    matchedTargets: matchedTargets || [],

    acertos,
    erros,
    tentativas,

    isCompleted,

    handleDragEnd,
  };
}
