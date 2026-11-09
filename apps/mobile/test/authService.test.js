import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSession, getToken, login, logout } from "../src/services/authService";

const student = { id: "student-id", name: "Ana", role: "student", points: 0 };
const response = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

describe("authService", () => {
  beforeEach(() => {
    logout();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => vi.unstubAllGlobals());

  it("confirma o aluno em /auth/me antes de manter o token", async () => {
    fetch.mockResolvedValueOnce(response({ accessToken: "token" })).mockResolvedValueOnce(response(student));

    await expect(login(" ana@example.com ", "senha")).resolves.toEqual(student);
    expect(fetch).toHaveBeenNthCalledWith(1, "http://api.test/auth/login", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ email: "ana@example.com", password: "senha" }),
    }));
    expect(fetch).toHaveBeenNthCalledWith(2, "http://api.test/auth/me", { headers: { Authorization: "Bearer token" } });
    expect(getToken()).toBe("token");
  });

  it("rejeita credenciais invalidas sem manter uma sessao", async () => {
    fetch.mockResolvedValue(response({}, 401));

    await expect(login("ana@example.com", "errada")).rejects.toThrow("E-mail ou senha invalidos");
    expect(getToken()).toBeNull();
  });

  it("rejeita perfil diferente de aluno", async () => {
    fetch.mockResolvedValueOnce(response({ accessToken: "token" })).mockResolvedValueOnce(response({ ...student, role: "teacher" }));

    await expect(login("ana@example.com", "senha")).rejects.toThrow("Acesso permitido somente para alunos");
    expect(getToken()).toBeNull();
  });

  it.each([401, 403])("limpa sessao expirada com status %i", async (status) => {
    fetch.mockResolvedValue(response({}, status));

    await expect(getSession("expired-token")).resolves.toBeNull();
    expect(getToken()).toBeNull();
  });
});
