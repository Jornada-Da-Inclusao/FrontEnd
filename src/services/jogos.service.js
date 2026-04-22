export const JogosService = {
  getPorDependente: async (dependenteId) => {
    try {
      const data = await request({
        method: "GET",
        url: "/infoJogos",
      });

      return data.filter((jogo) => jogo.dependente.id === Number(dependenteId));
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      return [];
    }
  },
};
