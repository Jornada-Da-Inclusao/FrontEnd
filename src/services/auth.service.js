import request from "./api.service";

export const AuthService = {
  updatePassword: (data) =>
    request({
      method: "PATCH",
      url: "/senha/atualizar",
      data,
    }),
};
