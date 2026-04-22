import request from "./api.service";

export const InfoJogosService = {
  registrar: (dados) =>
    request({
      method: "POST",
      url: "/infoJogos",
      data: dados,
    }),

  getByDependenteId: (dependenteId) =>
    request({
      method: "GET",
      url: `/infoJogos/dependente/${dependenteId}`,
    }),
};
