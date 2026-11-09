import { getApiUrl } from "../config/api";

export async function request(path, options = {}, token) {
  if (!token) {
    throw new Error("E necessario fazer login para carregar as avaliacoes.");
  }

  const headers = { ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "Nao foi possivel concluir a operacao. Tente novamente.";
    if (response.status === 401 || response.status === 403) message = "Sua sessao nao foi autorizada. Faca login novamente.";
    if (response.status === 409) message = "Voce ja respondeu esta avaliacao. Uma nova tentativa nao e permitida.";
    if (response.status === 404) message = "Avaliacao nao encontrada ou indisponivel.";
    if (response.status === 400 && path.endsWith("/attempts")) message = "Avaliacao indisponivel ou respostas invalidas. Verifique se o prazo encerrou.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
}
