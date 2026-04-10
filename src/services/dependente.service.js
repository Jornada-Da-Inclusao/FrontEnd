import request from "./api.service";

export const DependenteService = {
  cadastrar: (dependente) =>
    request({
      method: "POST",
      url: "/dependente",
      data: dependente,
    }),

  buscarPorUsuario: (usuarioId) =>
    request({
      method: "GET",
      url: `/dependente/getDependenteByIdUsuario/${usuarioId}`,
    }),

  atualizar: (id, dados) =>
    request({
      method: "PATCH",
      url: `/dependente/${id}`,
      data: dados,
    }),

  deletar: (id) =>
    request({
      method: "DELETE",
      url: `/dependente/${id}`,
    }),

  downloadPdf: async (dependenteId) => {
    const blob = await request({
      method: "GET",
      url: `/dependente/exportPdf/${dependenteId}`,
      responseType: "blob",
    });

    downloadFile(blob, "relatorio.pdf");
  },

  downloadExcel: async (dependenteId) => {
    const blob = await request({
      method: "GET",
      url: `/dependente/exportExcel/${dependenteId}`,
      responseType: "blob",
    });

    downloadFile(blob, "relatorio.xlsx");
  },
};
