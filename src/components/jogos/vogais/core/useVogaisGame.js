import { useEffect, useMemo, useState } from "react";
import { randomizeArr } from "@/utils/utils";
import { vogaisFactory } from "./vogaisFactory";
import { scoreStore } from "../../scoreStore/scoreStore";

export function useVogaisGame(difficulty) {
  const rules = useMemo(() => {
    return vogaisFactory(difficulty);
  }, [difficulty]);

  const [letters, setLetters] = useState([]);
  const [droppedLetters, setDroppedLetters] = useState([]);
  const [gameData, setGameData] = useState(null);

  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [tentativas, setTentativas] = useState(0);

  // 🔥 sincroniza score global
  useEffect(() => {
    scoreStore.set({ acertos, erros });
  }, [acertos, erros]);

  // INIT GAME
  useEffect(() => {
    const data = rules.setup();

    setGameData(data);
    setLetters(randomizeArr(data.letters));

    // 🔥 reset estado do jogo ao iniciar
    setDroppedLetters([]);
    setAcertos(0);
    setErros(0);
    setTentativas(0);

    scoreStore.set({ acertos: 0, erros: 0 });
  }, [rules]);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    setTentativas((p) => p + 1);

    const letter = letters.find((l) => l.id === active.id);

    if (!letter) return;

    const ctx = {
      letter,
      letters,
      droppedLetters,
      gameData,
      over,
    };

    const isValid = rules.validate(ctx);

    if (!isValid) {
      setErros((p) => p + 1);
      return;
    }

    setDroppedLetters((p) => [...p, letter]);
    setLetters((p) => p.filter((l) => l.id !== letter.id));

    setAcertos((p) => p + 1);
  }

  const isCompleted = Boolean(
    gameData &&
    rules.isCompleted({
      letters,
      droppedLetters,
      gameData,
    }),
  );

  const descricao = useMemo(() => {
    if (!gameData) return "";

    return rules.description({
      gameData,
    });
  }, [rules, gameData]);

  return {
    titulo: rules.title,
    descricao,

    letters,
    droppedLetters,

    acertos,
    erros,
    tentativas,

    handleDragEnd,

    isCompleted,
  };
}
