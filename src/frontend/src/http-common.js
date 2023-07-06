import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-type": "application/json"
  }
});

const getAuthorizationRequest = (jwtToken) => {
  return axios.create({
    baseURL: "http://localhost:4000/api",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Barear ${jwtToken}`
    }
  });
};


export {
  request,
  getAuthorizationRequest,
};
