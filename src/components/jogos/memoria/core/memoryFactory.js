import { levelConfig } from "../levels/rules.level";

export function memoryFactory(difficulty) {
  const base = levelConfig[difficulty] || levelConfig.FACIL;

  return {
    pairs: base.pairs,

    validate: ({ c1, c2 }) => {
      return c1.name === c2.name;
    },

    isCompleted: ({ matched, cards }) => {
      return matched.length != 0 && cards.length != 0 && matched.length === cards.length;
    },
  };
}
