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

  validateMove({ item, target }) {
    const draggable = item || {};
    return draggable.id === target.traits.color;
  },

  isCompleted({ matchedTargets = [], targets = [] }) {
    return matchedTargets.length != 0 && targets.length != 0 && matchedTargets.length === targets.length;
  },
};
