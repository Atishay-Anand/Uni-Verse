import API from "./api";

export const loginUser = (data) => {
  return API.post("/login", data);
};

export const registerUser = (data) => {
  return API.post("/register", data);
};