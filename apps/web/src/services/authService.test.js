import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { login, getSession, logout } from './authService.js';
import { buscarAvaliacoes } from './examService.js';

const student = { id: 'student-id', name: 'Ana', email: 'ana@example.com', role: 'student', points: 0 };
const originalFetch = globalThis.fetch;

beforeEach(() => {
  const values = new Map();
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  delete globalThis.sessionStorage;
});

test('logs in both profiles, confirms identity with the API and retains only the token', async () => {
  for (const role of ['student', 'teacher']) {
    const user = { ...student, role };
    const calls = [];
    globalThis.fetch = async (url, options) => {
      calls.push([url, options]);
      return Response.json(url === '/auth/login' ? { accessToken: 'token' } : user);
    };

    assert.deepEqual(await login(' ana@example.com ', ' password ', role), user);
    assert.deepEqual(JSON.parse(calls[0][1].body), { email: 'ana@example.com', password: ' password ' });
    assert.equal(calls[1][0], '/auth/me');
    assert.equal(calls[1][1].headers.Authorization, 'Bearer token');
    assert.equal(sessionStorage.getItem('eduquest-token'), 'token');
    assert.deepEqual(await getSession(), user);
    logout();
    assert.equal(await getSession(), null);
  }
});

test('rejects invalid credentials without retaining a previous session', async () => {
  sessionStorage.setItem('eduquest-token', 'old-token');
  globalThis.fetch = async () => Response.json({}, { status: 401 });
  await assert.rejects(login(student.email, 'wrong', 'student'), /E-mail ou senha/);
  assert.equal(sessionStorage.getItem('eduquest-token'), null);
});

test('does not trust the profile selected in the form', async () => {
  globalThis.fetch = async (url) => Response.json(url === '/auth/login' ? { accessToken: 'token' } : student);
  await assert.rejects(login(student.email, 'password', 'teacher'), /perfil selecionado/);
  assert.equal(sessionStorage.getItem('eduquest-token'), null);
});

test('does not allow administrators into the web panels', async () => {
  globalThis.fetch = async (url) => Response.json(url === '/auth/login' ? { accessToken: 'token' } : { ...student, role: 'admin' });
  await assert.rejects(login(student.email, 'password', 'student'));
  assert.equal(sessionStorage.getItem('eduquest-token'), null);
});

test('clears expired, invalid or inactive sessions rejected by the API', async () => {
  for (const status of [401, 403]) {
    sessionStorage.setItem('eduquest-token', 'expired-token');
    globalThis.fetch = async () => Response.json({}, { status });
    assert.equal(await getSession(), null);
    assert.equal(sessionStorage.getItem('eduquest-token'), null);
  }
});

test('reports connectivity errors without accepting a login', async () => {
  globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
  await assert.rejects(login(student.email, 'password', 'student'));
  assert.equal(sessionStorage.getItem('eduquest-token'), null);
});

test('preserves a session when the API is temporarily unavailable', async () => {
  sessionStorage.setItem('eduquest-token', 'token');
  globalThis.fetch = async () => Response.json({}, { status: 503 });
  await assert.rejects(getSession());
  assert.equal(sessionStorage.getItem('eduquest-token'), 'token');
});

test('rejects an invalid login response without saving it', async () => {
  globalThis.fetch = async () => Response.json({});
  await assert.rejects(login(student.email, 'password', 'student'));
  assert.equal(sessionStorage.getItem('eduquest-token'), null);
});

test('uses the session token when loading the student home evaluations', async () => {
  sessionStorage.setItem('eduquest-token', 'token');
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/exams');
    assert.equal(options.headers.Authorization, 'Bearer token');
    return Response.json([]);
  };
  assert.deepEqual(await buscarAvaliacoes(), []);
});

test('identifies unauthorized evaluation requests so the page can end the session', async () => {
  for (const status of [401, 403]) {
    globalThis.fetch = async () => Response.json({}, { status });
    await assert.rejects(buscarAvaliacoes('token'), (error) => error.status === status);
  }
});
