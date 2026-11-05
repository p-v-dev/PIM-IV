
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import Navbar from "../../components/layout/Navbar";
import EvaluationCard from "../../components/student/EvaluationCard";
import { useNavigate } from "react-router";
import { buscarAvaliacoes } from "../../services/examService.js";
import { logout } from "../../services/authService.js";

function StudentEvaluations() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [recarregar, setRecarregar] = useState(0);

  useEffect(() => {
    let active = true;
    buscarAvaliacoes()
      .then((dados) => { if (active) setAvaliacoes(dados); })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) {
          logout();
          navigate("/login", { replace: true });
        } else {
          setErro("Não foi possível carregar as avaliações. Tente novamente.");
        }
      })
      .finally(() => { if (active) setCarregando(false); });
    return () => { active = false; };
  }, [navigate, recarregar]);

  const avaliacoesFiltradas = avaliacoes.filter((avaliacao) =>
    `${avaliacao.title} ${avaliacao.description}`
      .toLowerCase()
      .includes(busca.toLowerCase()),
  );

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
              Suas avaliações
            </h1>

            <p className="mt-2 text-[#5f5b73]">
              Consulte os questionários disponíveis e escolha uma avaliação para realizar.
            </p>
          </header>

          <section className="mt-8" aria-labelledby="lista-avaliacoes">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  id="lista-avaliacoes"
                  className="text-2xl font-bold text-[#29263d]"
                >
                  Avaliações disponíveis
                </h2>
                <p className="mt-1 text-sm text-[#29263d]">
                  {carregando || erro ? "-" : avaliacoesFiltradas.length} avaliações encontradas
                </p>
              </div>

              <label className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 sm:w-80">
                <FiSearch className="shrink-0 text-[#6b59df]" aria-hidden="true" />
                <span className="sr-only">Buscar avaliação</span>
                <input
                  type="search"
                  value={busca}
                  onChange={(evento) => setBusca(evento.target.value)}
                  placeholder="Buscar por título ou descrição"
                  className="w-full bg-transparent text-sm text-[#29263d] outline-none placeholder:text-[#8b879e]"
                />
              </label>
            </div>

            {carregando && <p role="status" className="rounded-2xl bg-white p-6">Carregando avaliações...</p>}
            {!carregando && erro && <div role="alert" className="rounded-2xl bg-white p-6"><p>{erro}</p><button type="button" onClick={() => { setCarregando(true); setErro(""); setRecarregar((value) => value + 1); }} className="mt-3 font-semibold text-[#6b59df]">Tentar novamente</button></div>}
            {!carregando && !erro && (avaliacoesFiltradas.length === 0 ? (
              <p className="rounded-2xl bg-white p-6 text-[#5f5b73]">
                {avaliacoes.length ? "Nenhuma avaliação corresponde à sua busca." : "Nenhuma avaliação disponível no momento."}
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {avaliacoesFiltradas.map((avaliacao) => (
                  <EvaluationCard key={avaliacao.id} avaliacao={avaliacao} />
                ))}
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

export default StudentEvaluations;
