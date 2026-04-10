import request from "./api.service";

export const UsuarioService = {
  cadastrar: (dados) =>
    request({
      method: "POST",
      url: "/usuarios",
      data: dados,
    }),

  login: (dados) =>
    request({
      method: "POST",
      url: "/auth/login",
      data: dados,
    }),

  listar: () =>
    request({
      method: "GET",
      url: "/usuarios",
    }),

  buscarPorId: (id) =>
    request({
      method: "GET",
      url: `/usuarios/${id}`,
    }),

  atualizar: (id, dados) =>
    request({
      method: "PUT",
      url: `/usuarios/${id}`,
      data: dados,
    }),

  atualizarParcial: (id, dados) =>
    request({
      method: "PATCH",
      url: `/usuarios/${id}`,
      data: dados,
    }),

  deletar: (id) =>
    request({
      method: "DELETE",
      url: `/usuarios/${id}`,
    }),
};
