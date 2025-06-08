"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

type AuthUser = {
  id: number;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  loading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
  token: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from cookies
  useEffect(() => {
    const userCookie = Cookies.get("user");
    const tokenCookie = Cookies.get("token");
    if (userCookie && tokenCookie) {
      setUser(JSON.parse(userCookie));
      setToken(tokenCookie);
    }
    setLoading(false);
  }, []);

  const login = (userObj: AuthUser, tokenStr: string) => {
    setUser(userObj);
    setToken(tokenStr);
    Cookies.set("user", JSON.stringify(userObj), { expires: 7 });
    Cookies.set("token", tokenStr, { expires: 7 });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("user");
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);