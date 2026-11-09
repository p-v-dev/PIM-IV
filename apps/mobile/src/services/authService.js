import { getApiUrl, isDemoMode } from "../config/api";
import { demoUser } from "./demoData";

let token = null;

export function getToken() {
  return token;
}

export function logout() {
  token = null;
}

export async function getSession(sessionToken = getToken()) {
  if (isDemoMode) return demoUser;
  if (!sessionToken) return null;

  const response = await fetch(`${getApiUrl()}/auth/me`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  });

  if (response.status === 401 || response.status === 403) {
    logout();
    return null;
  }
  if (!response.ok) throw new Error("Nao foi possivel verificar sua sessao. Tente novamente.");

  const user = await response.json();
  if (!user?.id || user.role !== "student") {
    logout();
    return null;
  }

  return user;
}

export async function login(email, password) {
  if (isDemoMode) return demoUser;
  logout();
  const response = await fetch(`${getApiUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim(), password }),
  });

  if (response.status === 401) {
    throw new Error("E-mail ou senha invalidos, ou conta desativada.");
  }
  if (!response.ok) throw new Error("Nao foi possivel entrar. Confira os dados e tente novamente.");

  const { accessToken } = await response.json();
  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("Resposta de autenticacao invalida.");
  }

  const user = await getSession(accessToken);
  if (!user) throw new Error("Acesso permitido somente para alunos com conta ativa.");

  token = accessToken;
  return user;
}
