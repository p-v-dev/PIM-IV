export const demoUser = {
  id: "demo-student",
  name: "Ana Souza",
  email: "ana@example.com",
  role: "student",
  points: 120,
};

export const demoExams = [
  {
    id: "demo-html",
    title: "Fundamentos de HTML",
    description: "Revise as estruturas basicas de uma pagina web.",
    deadline: "2026-12-20T20:00:00.000Z",
    questions: [
      { id: "demo-html-1", prompt: "Qual tag representa o titulo principal de uma pagina?", options: ["<p>", "<h1>", "<title>", "<header>"] },
      { id: "demo-html-2", prompt: "Qual atributo informa o destino de um link?", options: ["src", "alt", "href", "class"] },
    ],
  },
  {
    id: "demo-js",
    title: "Logica com JavaScript",
    description: "Pratique variaveis, condicoes e repeticoes.",
    deadline: "2026-12-27T20:00:00.000Z",
    questions: [
      { id: "demo-js-1", prompt: "Qual estrutura executa um bloco quando uma condicao e verdadeira?", options: ["if", "for", "const", "return"] },
      { id: "demo-js-2", prompt: "Qual palavra declara uma constante em JavaScript?", options: ["let", "var", "const", "function"] },
    ],
  },
];

export const demoLeaderboard = [
  { studentId: "demo-1", name: "Marina Costa", points: 180 },
  { studentId: "demo-student", name: "Ana Souza", points: 120 },
  { studentId: "demo-3", name: "Lucas Lima", points: 90 },
];

export const demoAttempts = [
  { id: "demo-attempt-1", examId: "done-html", title: "Introducao a HTML", score: 8, totalQuestions: 10, createdAt: "2026-10-28T14:30:00.000Z" },
  { id: "demo-attempt-2", examId: "done-css", title: "Estilos com CSS", score: 6, totalQuestions: 8, createdAt: "2026-10-17T17:00:00.000Z" },
];
