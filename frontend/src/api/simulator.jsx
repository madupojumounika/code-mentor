import api from "./axios";
//run code
export const runCode = async (language, code, problemId) => {
  const res = await api.post("/simulator/run", {
    language,
    code,
    problemId,
  });
  return res.data;
};

//submit code
export const submitCode = async (language, code, problemId) => {
  const res = await api.post("/simulator/submit", {
    language,
    code,
    problemId,
  });
  return res.data;
};
