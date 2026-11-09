import { getToken } from "./authService";
import { isDemoMode } from "../config/api";
import { demoAttempts, demoExams, demoLeaderboard } from "./demoData";
import { request } from "./api";

export async function buscarAvaliacoes(token = getToken()) {
  if (isDemoMode) return demoExams.map(({ questions, ...exam }) => exam);
  return request("/exams", {}, token);
}

export async function buscarAvaliacao(id, token = getToken()) {
  if (isDemoMode) {
    const exam = demoExams.find((item) => item.id === id);
    if (exam) return exam;
    throw Object.assign(new Error("Avaliacao nao encontrada ou indisponivel."), { status: 404 });
  }
  return request(`/exams/${encodeURIComponent(id)}`, {}, token);
}

export async function enviarRespostas(examId, answers, token = getToken()) {
  if (isDemoMode) {
    const exam = demoExams.find((item) => item.id === examId);
    if (!exam || answers.length !== exam.questions.length) {
      throw Object.assign(new Error("Avaliacao indisponivel ou respostas invalidas. Verifique se o prazo encerrou."), { status: 400 });
    }
    return { score: 2, totalQuestions: exam.questions.length, pointsEarned: 20 };
  }
  return request(`/exams/${encodeURIComponent(examId)}/attempts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answers: answers.map(({ questionId, selectedOptionIndex }) => ({ questionId, selectedOptionIndex })),
    }),
  }, token);
}

export async function buscarHistorico(token = getToken()) {
  if (isDemoMode) return demoAttempts;
  return request("/attempts/me", {}, token);
}

export async function buscarLeaderboard(token = getToken()) {
  if (isDemoMode) return demoLeaderboard;
  return request("/leaderboard", {}, token);
}
