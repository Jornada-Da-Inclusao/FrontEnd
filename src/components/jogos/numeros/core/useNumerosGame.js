import { useEffect, useMemo, useState } from "react";
import { randomizeArr } from "@/utils/utils.js";
import { gameFactory } from "./gameFactory";
import { scoreStore } from "../../scoreStore/scoreStore";

export function useNumerosGame(difficulty) {
  const [rules] = useState(() => {
    const r = gameFactory(difficulty);

    if (r.getMode) {
      return {
        ...r,
        mode: r.getMode(),
      };
    }

    return r;
  });

  const [numbers, setNumbers] = useState([]);
  const [droppedNumbers, setDroppedNumbers] = useState([]);
  const [gameData, setGameData] = useState(null);

  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [tentativas, setTentativas] = useState(0);

  // 🔥 sincroniza com store global
  useEffect(() => {
    scoreStore.set({ acertos, erros });
  }, [acertos, erros]);

  // INIT GAME
  useEffect(() => {
    const data = rules.generateNumbers();

    setGameData(data);
    setNumbers(randomizeArr(data.numbers ?? data));

    // 🔥 reset score ao iniciar jogo
    setAcertos(0);
    setErros(0);
    setTentativas(0);

    scoreStore.set({ acertos: 0, erros: 0 });
  }, [rules]);

  const isCompleted =
    gameData &&
    rules?.isCompleted?.({ numbers, droppedNumbers, gameData });

  function handleDragEnd(event) {
    const { active, over } = event;

    setTentativas((p) => p + 1);

    const number = numbers.find((n) => n.id === active.id);
    if (!number) return;

    const isValid = rules.validate({
      number,
      numbers,
      droppedNumbers,
      over,
      mode: rules.mode,
      gameData,
    });

    if (!over || !isValid) {
      setErros((p) => p + 1);
      return;
    }

    setDroppedNumbers((p) => [...p, number]);
    setNumbers((p) => p.filter((n) => n.id !== number.id));

    setAcertos((p) => p + 1);
  }

  const descricao = useMemo(() => {
    if (typeof rules.description === "function") {
      if (!gameData) return "";

      try {
        return rules.description({
          gameData,
          mode: rules.mode,
        });
      } catch {
        return rules.description(gameData);
      }
    } else if (rules.getDescription) {
      return rules.getDescription(rules.mode);
    }

    return rules.description;
  }, [rules, gameData]);

  return {
    titulo: rules.title,
    descricao,
    numbers,
    droppedNumbers,
    handleDragEnd,
    acertos,
    erros,
    tentativas,
    isCompleted,
  };
}
