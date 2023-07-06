import { request } from "../http-common";

const registration = (data) => {
  return request.post("/authentication/register", data);
};

const login = (data) => {
  return request.post("/authentication/login", data);
};

export {
  registration,
  login
};