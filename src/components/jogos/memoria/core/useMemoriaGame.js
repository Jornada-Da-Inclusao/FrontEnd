import { useEffect, useMemo, useState } from "react";
import { randomizeArr } from "@/utils/utils";
import { memoryFactory } from "./memoryFactory";

export function useMemoriaGame(difficulty, cardsData) {
  const config = useMemo(() => memoryFactory(difficulty), [difficulty]);

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);

  const [tentativas, setTentativas] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);

  // const isCompleted = useMemo(() => {
  //   return config.isCompleted({ matched, cards });
  // }, [matched, cards, config]);
  const isCompleted = false;

  // INIT - monta deck baseado na dificuldade
  useEffect(() => {
    const selectedPairs = randomizeArr(cardsData).slice(0, config.pairs);

    const duplicated = [...selectedPairs, ...selectedPairs];

    setCards(randomizeArr(duplicated));

    // reset estado quando muda dificuldade
    setFlipped([]);
    setMatched([]);
    setTentativas(0);
    setAcertos(0);
    setErros(0);
  }, [cardsData, config.pairs]);

  function flipCard(index) {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(index)
    )
      return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setTentativas((p) => p + 1);

      const [i1, i2] = newFlipped;
      const c1 = cards[i1];
      const c2 = cards[i2];

      const isMatch = config.validate({ c1, c2 });

      if (isMatch) {
        setMatched((p) => [...p, i1, i2]);
        setAcertos((p) => p + 1);
      } else {
        setErros((p) => p + 1);
      }

      setTimeout(() => setFlipped([]), 500);
    }
  }

  return {
    cards,
    flipped,
    matched,
    flipCard,
    tentativas,
    acertos,
    erros,
    isCompleted,
  };
}
