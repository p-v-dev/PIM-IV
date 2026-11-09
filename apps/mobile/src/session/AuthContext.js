import { createContext, useContext, useState } from "react";
import { isDemoMode } from "../config/api";
import * as authService from "../services/authService";
import { demoUser } from "../services/demoData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(isDemoMode ? demoUser : null);

  async function signIn(email, password) {
    const session = await authService.login(email, password);
    setUser(session);
    return session;
  }

  function signOut() {
    if (isDemoMode) return;
    authService.logout();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
