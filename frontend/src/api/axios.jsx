import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Autorefresh expired token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response.data?.message === "Token expired, refresh needed" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.reject(error);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh-token",
          { token: refreshToken }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Run code
export const runCode = async (language, code, problemId) => {
  if (!language || !code || !problemId) {
    throw new Error("Missing fields: language, code, or problemId");
  }

  try {
    const res = await api.post("/simulator/run", {
      language,
      code,
      problemId,
    });
    return res.data;
  } catch (err) {
    if (err.response?.data?.error) {
      throw new Error(err.response.data.error);
    }
    throw err instanceof Error ? err : new Error("Unknown error running code");
  }
};

export const submitCode = async (language, code, problemId) => {
  if (!language || !code || !problemId) {
    throw new Error("Missing fields: language, code, or problemId");
  }

  const res = await api.post("/simulator/submit", {
    language,
    code,
    problemId,
  });

  return res.data;
};

export default api;
