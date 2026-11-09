import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buscarAvaliacoes, enviarRespostas } from "../src/services/examService";

const response = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

describe("examService", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it("envia Bearer ao carregar avaliacoes", async () => {
    fetch.mockResolvedValue(response([]));

    await expect(buscarAvaliacoes("token")).resolves.toEqual([]);
    expect(fetch).toHaveBeenCalledWith("http://api.test/exams", { headers: { Authorization: "Bearer token" } });
  });

  it("envia apenas respostas aceitas pelo contrato", async () => {
    fetch.mockResolvedValue(response({ score: 1, totalQuestions: 1, pointsEarned: 10 }));

    await enviarRespostas("exam-id", [{ questionId: "question-id", selectedOptionIndex: 1, ignored: true }], "token");
    expect(fetch).toHaveBeenCalledWith("http://api.test/exams/exam-id/attempts", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer token" },
      body: JSON.stringify({ answers: [{ questionId: "question-id", selectedOptionIndex: 1 }] }),
    }));
  });

  it.each([[401, "Sua sessao"], [403, "Sua sessao"], [404, "indisponivel"], [409, "ja respondeu"]])("identifica erro HTTP %i", async (status, message) => {
    fetch.mockResolvedValue(response({}, status));

    await expect(buscarAvaliacoes("token")).rejects.toMatchObject({ status, message: expect.stringContaining(message) });
  });

  it("propaga falha de rede", async () => {
    fetch.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(buscarAvaliacoes("token")).rejects.toThrow("Failed to fetch");
  });
});
