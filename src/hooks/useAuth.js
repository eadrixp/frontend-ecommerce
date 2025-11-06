import { createContext, useContext, useState, useEffect } from "react";
import { getToken, saveToken, removeToken } from "../utils/storage";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());
  const navigate = useNavigate();

  const setToken = (newToken) => {
    if (newToken) {
      saveToken(newToken);
      setTokenState(newToken);
    } else {
      removeToken();
      setTokenState(null);
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    navigate("/");
  };

  useEffect(() => {
    const stored = getToken();
    if (stored) setTokenState(stored);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export default useAuth;
