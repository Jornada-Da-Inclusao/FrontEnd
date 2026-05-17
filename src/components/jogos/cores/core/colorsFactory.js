// core/colorsGame.factory.js

import { level1 } from "../levels/level1/rules.level1";
import { level2 } from "../levels/level2/rules.level2";
import { level3 } from "../levels/level3/rules.level3";

const levels = {
  FACIL: level1,
  MEDIO: level2,
  DIFICIL: level3,
};

export function colorsGameFactory(difficulty) {
  return levels[difficulty] || level1;
}
