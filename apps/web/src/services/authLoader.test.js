import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { requireUser } from './authLoader.js';

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
  delete globalThis.sessionStorage;
});

test('redirects anonymous visitors to login without requesting protected data', async () => {
  globalThis.sessionStorage = { getItem: () => null };
  globalThis.fetch = async () => assert.fail('Should not request data without a token');
  await assert.rejects(requireUser('student')(), (response) => response.status === 302 && response.headers.get('Location') === '/login');
});

test('allows only the role confirmed by the API', async () => {
  globalThis.sessionStorage = { getItem: () => 'token' };
  for (const role of ['student', 'teacher']) {
    const user = { id: 'id', role, name: 'Ana' };
    globalThis.fetch = async () => Response.json(user);
    assert.deepEqual(await requireUser(role)(), user);
    const otherRole = role === 'student' ? 'teacher' : 'student';
    await assert.rejects(requireUser(otherRole)(), (response) => response.status === 302 && response.headers.get('Location') === '/');
  }
});
