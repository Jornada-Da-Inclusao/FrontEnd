let score = {
  acertos: 0,
  erros: 0,
};

const listeners = new Set();

export const scoreStore = {
  get: () => score,

  set: (newScore) => {
    score = newScore;

    listeners.forEach((fn) => fn(score));
  },

  subscribe: (fn) => {
    listeners.add(fn);

    return () => listeners.delete(fn);
  },
};
