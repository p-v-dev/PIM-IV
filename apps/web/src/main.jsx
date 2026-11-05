import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Link, Outlet, RouterProvider } from "react-router";
import App from "./App.jsx";
import StudentFAQ from "./pages/student/StudentFAQ.jsx";
import StudentEvaluations from "./pages/student/StudentEvaluations.jsx";
import StudentPerformance from "./pages/student/StudentPerformance.jsx";
import StudentExam from "./pages/student/StudentExam.jsx";
import Login from "./pages/auth/Login.jsx";
import StudentHome from "./pages/student/StudentHome.jsx";
import Professor from "./pages/Professor.jsx";
import { requireUser } from "./services/authLoader.js";
import "./index.css";

const router = createBrowserRouter([
  {
    element: <Outlet />,
    hydrateFallbackElement: <p role="status" className="p-6">Verificando sessão...</p>,
    errorElement: (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#a69cf3] p-6 text-[#29263d]">
        <p role="alert">Não foi possível acessar a plataforma. Verifique a conexão com a API e tente novamente.</p>
        <Link to="/login" className="rounded-xl bg-white px-5 py-3 font-semibold">Voltar ao login</Link>
      </main>
    ),
    children: [
      { path: "/", loader: requireUser(), element: <App /> },
      { path: "/professor", loader: requireUser("teacher"), element: <Professor /> },
      {
        id: "student",
        loader: requireUser("student"),
        shouldRevalidate: () => true,
        element: <Outlet />,
        children: [
          { path: "/aluno", element: <StudentHome /> },
          { path: "/faq", element: <StudentFAQ /> },
          { path: "/avaliacoes", element: <StudentEvaluations /> },
          { path: "/desempenho", element: <StudentPerformance /> },
          { path: "/avaliacao/:id", element: <StudentExam /> },
        ],
      },
      { path: "/login", element: <Login /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
