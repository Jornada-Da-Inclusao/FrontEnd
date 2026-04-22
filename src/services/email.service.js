import request from "./api.service";

export const EmailService = {
  sendToken: (data) =>
    request({
      method: "POST",
      url: "/emailApi/token",
      data,
    }),

  verifyToken: (token) =>
    request({
      method: "GET",
      url: `/emailApi/token/${token}`,
    }),
};
