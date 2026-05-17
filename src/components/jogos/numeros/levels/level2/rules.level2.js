const MODES = {
  ASC: "ASC",
  DESC: "DESC",
  MAX: "MAX",
  MIN: "MIN",
  EVEN_ODD: "EVEN_ODD",
  ODD_EVEN: "ODD_EVEN",
};

const getDescriptionByMode = (mode) => {
  switch (mode) {
    case MODES.ASC:
      return "Coloque os números do menor para o maior.";

    case MODES.DESC:
      return "Coloque os números do maior para o menor.";

    case MODES.MAX:
      return "Sempre escolha o maior número da tela.";

    case MODES.MIN:
      return "Sempre escolha o menor número da tela.";

    case MODES.EVEN_ODD:
      return "Primeiro coloque os números pares, depois os ímpares.";

    case MODES.ODD_EVEN:
      return "Primeiro coloque os números ímpares, depois os pares.";

    default:
      return "Descubra a regra e organize os números corretamente.";
  }
};

const RULE_TYPE = {
  SEQUENTIAL: "sequential",
  SET: "set",
};

const MODE_CONFIG = {
  ASC: RULE_TYPE.SEQUENTIAL,
  DESC: RULE_TYPE.SEQUENTIAL,

  EVEN_ODD: RULE_TYPE.SET,
  ODD_EVEN: RULE_TYPE.SET,
  MAX: RULE_TYPE.SET,
  MIN: RULE_TYPE.SET,
};

function validateSet({ number, remaining, droppedNumbers, mode }) {
  switch (mode) {
    case MODES.EVEN_ODD: {
      const evens = remaining.filter((n) => n.value % 2 === 0);
      const odds = remaining.filter((n) => n.value % 2 !== 0);

      const hasEvensLeft = evens.length > 0;

      if (hasEvensLeft) {
        const isValid = number.value % 2 === 0;

        return isValid;
      }

      const isValid = number.value % 2 !== 0;

      return isValid;
    }

    case MODES.ODD_EVEN: {
      const odds = remaining.filter((n) => n.value % 2 !== 0);
      const evens = remaining.filter((n) => n.value % 2 === 0);

      const hasOddsLeft = odds.length > 0;

      if (hasOddsLeft) {
        const isValid = number.value % 2 !== 0;

        return isValid;
      }

      const isValid = number.value % 2 === 0;

      return isValid;
    }

    case MODES.MAX: {
      const max = Math.max(...remaining.map((n) => n.value));

      const isValid = number.value === max;

      return isValid;
    }

    case MODES.MIN: {
      const min = Math.min(...remaining.map((n) => n.value));

      const isValid = number.value === min;

      return isValid;
    }

    default:
      console.error("[UNKNOWN MODE]");
      console.error("Invalid mode received:", mode);

      return false;
  }
}

function validateSequential({ number, remaining, droppedNumbers, mode }) {
  const sorted = [...remaining].sort((a, b) => a.value - b.value);
  const reversed = [...sorted].reverse();

  switch (mode) {
    case MODES.ASC: {
      const expected = sorted[0];

      return number.value === expected?.value;
    }

    case MODES.DESC: {
      const expected = reversed[0];

      return number.value === expected?.value;
    }

    default:
      console.error("[UNKNOWN MODE]");
      console.error("Invalid mode received:", mode);

      return false;
  }
}

export const level2 = {
  title: "Trilha dos Números",

  getDescription: (mode) => getDescriptionByMode(mode),

  generateNumbers: () => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      value: i + 1,
    }));
  },

  validate: ({ number, numbers, droppedNumbers, mode }) => {
    const remaining = numbers;

    const type = MODE_CONFIG[mode];

    if (type === RULE_TYPE.SET) {
      return validateSet({
        number,
        remaining,
        droppedNumbers,
        mode,
      });
    }

    return validateSequential({
      number,
      remaining,
      droppedNumbers,
      mode,
    });
  },

  isCompleted: (numbers) => numbers.length === 0,

  getMode: () => {
    const modes = Object.values(MODES);
    return modes[Math.floor(Math.random() * modes.length)];
  },
};
