import api from "./axios";

// LOGIN
export const loginUser = async ({ email, password }) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("accessToken", res.data.token);
  localStorage.setItem("refreshToken", res.data.refreshToken);
  return res.data;
};

// REGISTER
export const registerUser = async ({ name, email, password }) => {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data;
};

// GET PROFILE
export const getProfile = async () => {
  const res = await api.get("/auth/profile"); 
  return res.data;
};
