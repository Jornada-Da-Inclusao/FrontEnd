import { animals } from "../../data/animals.data";
import { colorBlocks } from "../../data/colors.data";

// Level 2: Shapes + Colors
// Each target (animal) is assigned a shape; draggables are shaped swatches in the
// animal's target color. Player must drag the correct shape+color to the animal.

const SHAPES = ["circle", "square", "triangle"];

export const level2 = {
  title: "Formas e Cores",

  getDescription() {
    return "Arraste a forma com a cor correta para o bichinho correspondente.";
  },

  createGame() {
    // Use animals list as targets, but add a shape trait for this level
    const targets = animals.map((a, idx) => ({
      ...a,
      traits: {
        ...a.traits,
        shape: SHAPES[idx % SHAPES.length],
      },
    }));

    // For MEDIO we intentionally reduce the number of distinct colors
    // so that different figures may share the same color while keeping
    // every (shape,color) pair unique and therefore distinguishable.
    const targetCount = targets.length;

    // Choose a smaller palette size (half the targets, minimum 2)
    const paletteSize = Math.max(2, Math.ceil(targetCount / 2));

    // Pick the first `paletteSize` colors from colorBlocks (randomization
    // could be added, but deterministic selection keeps tests stable)
    const palette = colorBlocks.slice(0, paletteSize);

    // Build all possible (shape, color) combinations and shuffle them
    const combos = [];
    for (const shape of SHAPES) {
      for (const color of palette) {
        combos.push({ shape, color });
      }
    }

    // Simple Fisher-Yates shuffle
    for (let i = combos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combos[i], combos[j]] = [combos[j], combos[i]];
    }

    // Assign the first `targetCount` unique combos to targets
    const assigned = combos.slice(0, targetCount);

    const targetsWithPairs = targets.map((t, idx) => {
      const { shape, color } = assigned[idx];
      return {
        ...t,
        traits: {
          ...t.traits,
          shape,
          // override the color trait so multiple targets can share colors
          color: color.id,
        },
      };
    });

    // Create draggables from the assigned combos
    const draggables = assigned.map(({ shape, color }) => ({
      id: `${shape}::${color.id}`,
      label: shape,
      shape,
      colorId: color.id,
      hex: color.hex || undefined,
    }));

    return {
      draggables,
      targets: targetsWithPairs,
    };
  },

  validateMove({ item, target }) {
    // item may come as { shape, colorId } or similar
    const shapeMatches = item.shape === target.traits?.shape;
    const colorMatches = item.colorId === target.traits?.color || item.id === target.traits?.color;
    return shapeMatches && colorMatches;
  },

  isCompleted({ matchedTargets, targets }) {
    return matchedTargets.length != 0 && targets.length != 0 && matchedTargets.length === targets.length;
  },
};
