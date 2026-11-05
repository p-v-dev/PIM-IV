import { getToken } from './authService.js';

async function request(path, options = {}, token = getToken()) {
  if (!token) {
    throw new Error(
      "É necessário fazer login para carregar as avaliações."
    );
  }

  const response = await fetch(path, {
    ...options,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw Object.assign(new Error("Sua sessão não foi autorizada. Faça login novamente."), { status: response.status });
    }

    let message = "Não foi possível concluir a operação. Tente novamente.";
    if (response.status === 409) message = "Você já respondeu esta avaliação. Uma nova tentativa não é permitida.";
    if (response.status === 404) message = "Avaliação não encontrada ou indisponível.";
    if (response.status === 400) {
      message = path.endsWith('/attempts')
        ? "Avaliação indisponível ou respostas inválidas. Verifique se o prazo encerrou."
        : options.method === 'POST'
          ? "Confira o título, a descrição, o prazo futuro e as questões selecionadas."
          : "Avaliação indisponível. Confira o endereço e o prazo.";
    }
    throw Object.assign(new Error(message), { status: response.status });
  }

  return response.json();
}

export function buscarAvaliacoes(token = getToken()) {
  return request('/exams', {}, token);
}

export function buscarMinhasAvaliacoes(token = getToken()) {
  return request('/exams/mine', {}, token);
}

export async function buscarHistorico(token = getToken()) {
  const resultados = await request('/attempts/me', {}, token);
  return resultados.map((resultado) => ({
    ...resultado,
    nota: resultado.totalQuestions > 0 ? resultado.score / resultado.totalQuestions * 10 : 0,
  }));
}

export function buscarQuestoes(token = getToken()) {
  return request('/questions', {}, token);
}

export function buscarAvaliacao(id, token = getToken()) {
  return request(`/exams/${encodeURIComponent(id)}`, {}, token);
}

export function enviarRespostas(examId, answers, token = getToken()) {
  return request(`/exams/${encodeURIComponent(examId)}/attempts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers: answers.map(({ questionId, selectedOptionIndex }) => ({ questionId, selectedOptionIndex })) }),
  }, token);
}

export async function criarAvaliacao({ title, description, deadline, questionIds }, token = getToken()) {
  if (!title.trim() || !description.trim()) throw new Error('Preencha o titulo e a descricao.');
  const date = new Date(deadline);
  if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) throw new Error('Informe um prazo futuro valido.');
  if (!questionIds.length) throw new Error('Selecione pelo menos uma questao.');
  return request('/exams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.trim(), description: description.trim(), deadline: date.toISOString(), questionIds }),
  }, token);
}
