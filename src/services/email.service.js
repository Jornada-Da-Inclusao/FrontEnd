import request from "./api.service";

export const EmailService = {
  postToken: () =>
    request({
      method: "POST",
      url: "/email/token",
    }),

  getToken: () =>
    request({
      method: "GET",
      url: "/email/token",
    }),
};
