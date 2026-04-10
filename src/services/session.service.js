export const SessionService = {
  getUser: () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");

    if (!usuario || !token) return null;

    return { usuario, token };
  },

  setPlayer: (dependente) => {
    if (!dependente?.id || !dependente?.nome || !dependente?.foto) {
      console.error("Dependente inválido");
      return;
    }

    const player = {
      id: dependente.id,
      nome: dependente.nome,
      foto: dependente.foto,
    };

    sessionStorage.setItem("player", JSON.stringify(player));
  },
};
