import { getAuthorizationRequest } from "../http-common";

const listPosts = (jwtToken, params) => {
  return getAuthorizationRequest(jwtToken).get("/post", { params });
};

const deletePost = (jwtToken, id) => {
  return getAuthorizationRequest(jwtToken).delete(`/post/${id}`);
};

const createPost = (jwtToken, data) => {
  return getAuthorizationRequest(jwtToken).post(`/post`, data);
};

const updatePost = (jwtToken, id, data) => {
  return getAuthorizationRequest(jwtToken).put(`/post/${id}`, data);
};

export {
  listPosts,
  deletePost,
  createPost,
  updatePost
};