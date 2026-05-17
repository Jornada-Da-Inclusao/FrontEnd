import { animals } from "../../data/animals.data";
import { colorBlocks } from "../../data/colors.data";
export const level1 = {
  title: "Jogo das Cores",

  createGame() {
    return {
      draggables: colorBlocks,
      targets: animals,
    };
  },

  getDescription() {
    return "Arraste as cores corretas para os animais.";
  },

  validateMove({ draggable, target }) {
    return draggable.id === target.traits.color;
  },

  isCompleted({ matchedTargets = [], targets = [] }) {
    return matchedTargets.length === targets.length;
  },
};
