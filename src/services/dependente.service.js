import { downloadFile } from "@/helper/downloadFile";
import request from "./api.service";

export const DependenteService = {
  cadastrar: (dependente) =>
    request({
      method: "POST",
      url: "/dependentes",
      data: dependente,
    }),

  buscarPorUsuario: (usuarioId) =>
    request({
      method: "GET",
      url: `/dependentes/usuario/${usuarioId}`,
    }),

  getInfoJogosByDependente: (usuarioId) =>
    request({
      method: "GET",
      url: `/dependentes/infoJogos/${usuarioId}`,
    }),

  atualizar: (id, dados) =>
    request({
      method: "PATCH",
      url: `/dependentes/${id}`,
      data: dados,
    }),

  deletar: (id) =>
    request({
      method: "DELETE",
      url: `/dependentes/${id}`,
    }),

  downloadPdf: async (dependenteId) => {
    const blob = await request({
      method: "GET",
      url: `/dependentes/${dependenteId}/export/pdf`,
      responseType: "blob",
    });

    downloadFile(blob, "relatorio.pdf");
  },

  downloadExcel: async (dependenteId) => {
    const blob = await request({
      method: "GET",
      url: `/dependentes/${dependenteId}/export/excel`,
      responseType: "blob",
    });

    downloadFile(blob, "relatorio.xlsx");
  },
};
