
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../../services/authService.js";
import {
  FiBookOpen,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState("student");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(evento) {
    evento.preventDefault();
    if (carregando) return;
    setErro("");

    if (!email.trim() || !senha.trim()) {
      setErro("Preencha seu e-mail e sua senha para continuar.");
      return;
    }
    setCarregando(true);
    try {
      const user = await login(email, senha, perfil);
      setSenha("");
      navigate(user.role === "student" ? "/aluno" : "/professor", { replace: true });
    } catch (error) {
      setErro(error instanceof TypeError ? "Não foi possível conectar à API. Tente novamente." : error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#a69cf3] px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-xl md:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#7665e8] p-8 text-white sm:p-12">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15">
            <FiBookOpen size={30} aria-hidden="true" />
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">
            Bem-vindo ao
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            EduQuest
          </h1>

          <p className="mt-5 max-w-sm leading-7 text-violet-100">
            Aprenda, pratique e acompanhe sua evolução. Cada desafio é uma
            oportunidade de conquistar novos conhecimentos e pontos.
          </p>

          <div className="mt-8 hidden rounded-2xl border border-white/20 bg-white/10 p-5 md:block">
            <p className="font-semibold">Sua jornada começa aqui!</p>
            <p className="mt-2 text-sm leading-6 text-violet-100">
              Realize avaliações, acompanhe seu desempenho e dispute posições
              no ranking de estudantes.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10 md:p-12">
          <h2 className="text-2xl font-bold text-[#29263d] sm:text-3xl">
            Entrar na plataforma
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#5f5b73]">
            Informe seus dados para acessar sua área de {perfil === "student" ? "estudante" : "professor"}.
          </p>

          <form onSubmit={handleSubmit} aria-busy={carregando} className="mt-8 space-y-5">
            <fieldset disabled={carregando} className="space-y-5">
            <legend className="sr-only">Dados de acesso</legend>
            <div>
                <div>
                  <p className="mb-3 text-sm font-semibold text-[#29263d]">
                    Entrar como
                  </p>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f6f5ff] p-1.5">
                    <button
                      type="button"
                      onClick={() => setPerfil("student")}
                      aria-pressed={perfil === "student"}
                      className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${perfil === "student"
                        ? "bg-[#7665e8] text-white shadow-sm"
                        : "text-[#5f5b73] hover:bg-white"
                        }`}
                    >
                      Estudante
                    </button>

                    <button
                      type="button"
                      onClick={() => setPerfil("teacher")}
                      aria-pressed={perfil === "teacher"}
                      className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${perfil === "teacher"
                        ? "bg-[#7665e8] text-white shadow-sm"
                        : "text-[#5f5b73] hover:bg-white"
                        }`}
                    >
                      Professor
                    </button>
                  </div>

                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-400">DADOS DE ACESSO</span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                </div>

              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#29263d]">
                E-mail
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <FiMail className="shrink-0 text-[#7665e8]" aria-hidden="true" />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-[#29263d] outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="senha"
                className="mb-2 block text-sm font-semibold text-[#29263d]"
              >
                Senha
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <FiLock className="shrink-0 text-[#7665e8]" aria-hidden="true" />

                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                  placeholder="Digite sua senha"
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-[#29263d] outline-none placeholder:text-gray-400"
                />

                <button
                  type="button"
                  onClick={() => setMostrarSenha((atual) => !atual)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="shrink-0 text-gray-500 hover:text-violet-700"
                >
                  {mostrarSenha ? <FiEyeOff size={19} /> : <FiEye size={19} />}
                </button>
              </div>
            </div>

            {erro && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
              >
                {erro}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-5 py-3.5 font-semibold text-white transition hover:bg-[#6553d5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              {carregando ? "Entrando..." : "Entrar"}
              <FiArrowRight aria-hidden="true" />
            </button>
            </fieldset>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            EduQuest · Plataforma de aprendizagem
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
