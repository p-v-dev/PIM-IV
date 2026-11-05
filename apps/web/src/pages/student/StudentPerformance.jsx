
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { buscarHistorico } from "../../services/examService.js";
import { logout } from "../../services/authService.js";
import {
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";

function StudentPerformance() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [recarregar, setRecarregar] = useState(0);

  useEffect(() => {
    let active = true;
    buscarHistorico()
      .then((dados) => { if (active) setResultados(dados); })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) {
          logout();
          navigate("/login", { replace: true });
        } else {
          setErro("Não foi possível carregar seu histórico. Tente novamente.");
        }
      })
      .finally(() => { if (active) setCarregando(false); });
    return () => { active = false; };
  }, [navigate, recarregar]);

  const resultadosFiltrados = resultados.filter((resultado) =>
    resultado.title
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

  const media =
    resultados.length > 0
      ? resultados.reduce((soma, resultado) => soma + resultado.nota, 0) /
      resultados.length
      : 0;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#a69cf3] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="rounded-[22px] bg-white p-6 shadow-sm sm:p-8">
            <span className="inline-flex rounded-full bg-[#eeeaff] px-3 py-1 text-sm font-semibold text-[#6b59df]">
              Área do estudante
            </span>

            <h1 className="mt-4 text-3xl font-bold text-[#29263d]">
              Meu desempenho
            </h1>

            <p className="mt-2 text-[#5f5b73]">
              Acompanhe suas notas e sua evolução nas avaliações realizadas.
            </p>
          </header>

          <section
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Resumo do desempenho"
          >
            <article className="rounded-[22px] bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeaff] text-[#6b59df]">
                <FiAward size={23} aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm text-[#5f5b73]">Média das notas</p>
              <p className="mt-1 text-3xl font-bold text-[#29263d]">
                {!carregando && !erro && resultados.length > 0 ? media.toLocaleString("pt-BR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }) : "-"}
                <span className="ml-1 text-base font-medium text-[#77728e]">
                  / 10
                </span>
              </p>
            </article>

            <article className="rounded-[22px] bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeaff] text-[#6b59df]">
                <FiCheckCircle size={23} aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm text-[#5f5b73]">
                Avaliações realizadas
              </p>
              <p className="mt-1 text-3xl font-bold text-[#29263d]">
                {carregando || erro ? "-" : resultados.length}
              </p>
            </article>

            <article className="rounded-[22px] bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeaff] text-[#6b59df]">
                <FiTrendingUp size={23} aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm text-[#5f5b73]">Maior nota</p>
              <p className="mt-1 text-3xl font-bold text-[#29263d]">
                {!carregando && !erro && resultados.length > 0
                  ? Math.max(...resultados.map((resultado) => resultado.nota))
                    .toLocaleString("pt-BR", { maximumFractionDigits: 1 })
                  : "-"}
                <span className="ml-1 text-base font-medium text-[#77728e]">
                  / 10
                </span>
              </p>
            </article>
          </section>

          <section className="mt-8" aria-labelledby="historico-heading">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  id="historico-heading"
                  className="text-2xl font-bold text-[#29263d]"
                >
                  Histórico de avaliações
                </h2>
                <p className="mt-1 text-sm text-[#29263d]">
                  Consulte suas notas por avaliação.
                </p>
              </div>

              <label className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 sm:w-80">
                <FiBookOpen className="shrink-0 text-[#6b59df]" aria-hidden="true" />
                <span className="sr-only">Buscar no histórico</span>
                <input
                  type="search"
                  value={busca}
                  onChange={(evento) => setBusca(evento.target.value)}
                  placeholder="Buscar pelo título da avaliação"
                  className="w-full bg-transparent text-sm text-[#29263d] outline-none placeholder:text-[#8b879e]"
                />
              </label>
            </div>

            {carregando && <p role="status" className="rounded-2xl bg-white p-6">Carregando histórico...</p>}
            {!carregando && erro && <div role="alert" className="rounded-2xl bg-white p-6"><p>{erro}</p><button type="button" onClick={() => { setCarregando(true); setErro(""); setRecarregar((value) => value + 1); }} className="mt-3 font-semibold text-[#6b59df]">Tentar novamente</button></div>}
            {!carregando && !erro && (resultadosFiltrados.length === 0 ? (
              <p className="rounded-2xl bg-white p-6 text-[#5f5b73]">
                {resultados.length ? "Nenhum resultado corresponde à sua busca." : "Você ainda não realizou avaliações."}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {resultadosFiltrados.map((resultado) => (
                  <article
                    key={resultado.id}
                    className="rounded-[22px] bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span className="inline-flex rounded-full bg-[#eeeaff] px-3 py-1 text-xs font-semibold text-[#6b59df]">
                          Concluída
                        </span>
                        <h3 className="mt-3 text-lg font-bold text-[#29263d]">
                          {resultado.title}
                        </h3>
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#5f5b73]">
                          <FiClock aria-hidden="true" />
                          Realizada em {new Date(resultado.createdAt).toLocaleString("pt-BR")}
                        </p>
                        <p className="mt-2 text-sm text-[#5f5b73]">Acertos: {resultado.score} de {resultado.totalQuestions}</p>
                      </div>

                      <div className="rounded-xl bg-[#f5f3ff] px-5 py-3 text-center">
                        <p className="text-xs text-[#5f5b73]">Nota</p>
                        <p className="text-2xl font-bold text-[#6b59df]">
                          {resultado.nota.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}
                          <span className="text-sm font-medium">/10</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs text-[#5f5b73]">
                        <span>Desempenho</span>
                        <span>
                          {Math.round(resultado.nota * 10)}%
                        </span>
                      </div>
                      <div
                        className="h-2 overflow-hidden rounded-full bg-[#eeeaff]"
                        role="progressbar"
                        aria-label={`Desempenho em ${resultado.title}`}
                        aria-valuemin={0}
                        aria-valuemax={10}
                        aria-valuenow={resultado.nota}
                      >
                        <div
                          className="h-full rounded-full bg-[#7665e8]"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, resultado.nota * 10),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

export default StudentPerformance;
