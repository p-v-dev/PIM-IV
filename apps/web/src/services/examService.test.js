import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { buscarMinhasAvaliacoes, buscarQuestoes, buscarTentativas, criarAvaliacao, buscarAvaliacao, desativarAvaliacao, enviarRespostas, buscarHistorico } from './examService.js';

const originalFetch = globalThis.fetch;
const input = () => ({ title: ' Title ', description: ' Description ', deadline: new Date(Date.now() + 86400000).toISOString(), questionIds: ['question-id'] });

beforeEach(() => { globalThis.sessionStorage = { getItem: () => 'token' }; });
afterEach(() => { globalThis.fetch = originalFetch; delete globalThis.sessionStorage; });

test('loads real questions and the current teachers exams with Bearer authentication', async () => {
  const paths = [];
  globalThis.fetch = async (path, options) => {
    paths.push(path);
    assert.equal(options.headers.Authorization, 'Bearer token');
    return Response.json([]);
  };
  assert.deepEqual(await buscarQuestoes(), []);
  assert.deepEqual(await buscarMinhasAvaliacoes(), []);
  assert.deepEqual(paths, ['/questions', '/exams/mine']);
});

test('loads attempts only for the selected exam with Bearer authentication', async () => {
  const attempts = [{ id: 'attempt-id', studentName: 'Student', score: 3, totalQuestions: 4, createdAt: '2026-11-01T12:00:00Z' }];
  globalThis.fetch = async (path, options) => {
    assert.equal(path, '/exams/exam-id/attempts');
    assert.equal(options.headers.Authorization, 'Bearer token');
    assert.equal(options.body, undefined);
    return Response.json(attempts);
  };
  assert.deepEqual(await buscarTentativas('exam-id'), attempts);
});

test('deactivates an exam using its real ID and the teacher session', async () => {
  const inactive = { id: 'exam-id', isActive: false };
  globalThis.fetch = async (path, options) => {
    assert.equal(path, '/exams/exam-id/deactivate');
    assert.equal(options.method, 'PATCH');
    assert.equal(options.headers.Authorization, 'Bearer token');
    return Response.json(inactive);
  };
  assert.deepEqual(await desativarAvaliacao('exam-id'), inactive);
});

test('sends only the API contract and uses the persisted exam returned by the server', async () => {
  const data = input();
  const saved = { ...data, id: 'persisted-id', teacherId: 'server-teacher-id' };
  globalThis.fetch = async (path, options) => {
    assert.equal(path, '/exams');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer token');
    assert.deepEqual(JSON.parse(options.body), { title: 'Title', description: 'Description', deadline: new Date(data.deadline).toISOString(), questionIds: ['question-id'] });
    return Response.json(saved, { status: 201 });
  };
  assert.deepEqual(await criarAvaliacao({ ...data, categoria: 'ignored', teacherId: 'not-trusted' }), saved);
});

test('rejects empty fields, no questions and invalid or past deadlines without a request', async () => {
  globalThis.fetch = async () => assert.fail('Invalid form must not be submitted');
  for (const patch of [{ title: '   ' }, { description: '   ' }, { questionIds: [] }, { deadline: '' }, { deadline: 'invalid' }, { deadline: '2020-01-01T12:00' }]) {
    await assert.rejects(criarAvaliacao({ ...input(), ...patch }));
  }
});

test('exposes session failures and does not turn failed creation into success', async () => {
  for (const status of [400, 401, 403, 500]) {
    globalThis.fetch = async () => Response.json({}, { status });
    await assert.rejects(criarAvaliacao(input()), (error) => error.status === status);
  }
  globalThis.fetch = async () => { throw new TypeError('Network failed'); };
  await assert.rejects(criarAvaliacao(input()), /Network failed/);
});

test('loads the selected exam content using its real ID', async () => {
  const exam = { id: 'exam-id', questions: [{ id: 'q1', prompt: 'Question', options: ['A', 'B'] }] };
  globalThis.fetch = async (path, options) => {
    assert.equal(path, '/exams/exam-id');
    assert.equal(options.headers.Authorization, 'Bearer token');
    return Response.json(exam);
  };
  assert.deepEqual(await buscarAvaliacao('exam-id'), exam);
});

test('submits answers without a client score and returns the official result', async () => {
  const result = { id: 'attempt-id', score: 1, totalQuestions: 1, pointsEarned: 10 };
  globalThis.fetch = async (path, options) => {
    assert.equal(path, '/exams/exam-id/attempts');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer token');
    assert.deepEqual(JSON.parse(options.body), { answers: [{ questionId: 'q1', selectedOptionIndex: 1 }] });
    return Response.json(result, { status: 201 });
  };
  assert.deepEqual(await enviarRespostas('exam-id', [{ questionId: 'q1', selectedOptionIndex: 1, score: 999 }]), result);
});

test('distinguishes duplicate attempts and unavailable exams from creation errors', async () => {
  for (const status of [400, 404, 409]) {
    globalThis.fetch = async () => Response.json({}, { status });
    await assert.rejects(enviarRespostas('exam-id', [{ questionId: 'q1', selectedOptionIndex: 1 }]), error => error.status === status && !error.message.includes('título'));
  }
});

test('loads the current students history and derives only display grades from stored scores', async () => {
  const history = [
    { id: 'a1', examId: 'e1', title: 'First', score: 3, totalQuestions: 4, createdAt: '2026-01-01T00:00:00Z' },
    { id: 'a2', examId: 'e2', title: 'Second', score: 1, totalQuestions: 1, createdAt: '2025-01-01T00:00:00Z' },
    { id: 'a3', examId: 'e3', title: 'Legacy', score: 0, totalQuestions: 0, createdAt: '2024-01-01T00:00:00Z' },
  ];
  globalThis.fetch = async (path, options) => {
    assert.equal(path, '/attempts/me');
    assert.equal(options.headers.Authorization, 'Bearer token');
    assert.equal(options.body, undefined);
    return Response.json(history);
  };
  assert.deepEqual(await buscarHistorico(), history.map((result, index) => ({ ...result, nota: [7.5, 10, 0][index] })));
});

test('keeps a genuinely empty history empty', async () => {
  globalThis.fetch = async () => Response.json([]);
  assert.deepEqual(await buscarHistorico(), []);
});

test('does not replace history request errors with an empty history', async () => {
  for (const status of [401, 403, 503]) {
    globalThis.fetch = async () => Response.json({}, { status });
    await assert.rejects(buscarHistorico(), error => error.status === status);
  }
  globalThis.fetch = async () => { throw new TypeError('Network failed'); };
  await assert.rejects(buscarHistorico(), /Network failed/);
});
