import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken"); // ✅ FIX

    if (storedUser && token) {
      setUser({ ...JSON.parse(storedUser), token });
    }

    setLoading(false);
  }, []);

  // Login
  const login = (token, userData) => {
    setUser({ ...userData, token });

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token); // already correct
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken"); // ✅ FIX
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
