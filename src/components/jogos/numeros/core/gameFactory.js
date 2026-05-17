import { level1 } from "../levels/level1/rules.level1";
import { level2 } from "../levels/level2/rules.level2";
import { level3 } from "../levels/level3/rules.level3";

export function gameFactory(difficulty) {
  switch (difficulty) {
    case "FACIL":
      return level1;

    case "MEDIO":
      return level2;

    case "DIFICIL":
      return level3;

    default:
      return level1;
  }
}
