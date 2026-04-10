import request from "./api.service";

export const LoginService = {
  login: (credenciais) =>
    request({
      method: "POST",
      url: "/auth/login",
      data: credenciais,
    }),
};