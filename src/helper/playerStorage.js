const PLAYER_STORAGE_KEY = "player";
const PLAYER_ID_KEY = "playerId";

export const playerStorage = {
  get: () => {
    try {
      return JSON.parse(sessionStorage.getItem(PLAYER_STORAGE_KEY));
    } catch {
      return null;
    }
  },

  set: (dependente) => {
    const player = {
      id: dependente.id,
      nome: dependente.nome,
      foto: dependente.foto,
    };

    sessionStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player));
    sessionStorage.setItem(PLAYER_ID_KEY, String(dependente.id));
  },
};
