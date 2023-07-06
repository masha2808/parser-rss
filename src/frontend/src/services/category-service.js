import { getAuthorizationRequest } from "../http-common";

const listCategories = (jwtToken) => {
  return getAuthorizationRequest(jwtToken).get("/category/");
};

export {
  listCategories,
};