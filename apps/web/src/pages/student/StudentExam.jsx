
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { buscarAvaliacao, enviarRespostas } from "../../services/examService.js";
import { logout } from "../../services/authService.js";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFlag,
} from "react-icons/fi";

function StudentExam() {
  const { id } = useParams();
  return <Exam key={id} id={id} />;
}

function Exam({ id }) {
  const navigate = useNavigate();
  const [avaliacao, setAvaliacao] = useState(null);
  const [erroCarga, setErroCarga] = useState("");
  const [recarregar, setRecarregar] = useState(0);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");
  const [bloqueada, setBloqueada] = useState(false);

  useEffect(() => {
    let active = true;
    buscarAvaliacao(id)
      .then((dados) => { if (active) setAvaliacao(dados); })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) {
          logout();
          navigate("/login", { replace: true });
        } else {
          setErroCarga(error instanceof TypeError ? "Não foi possível conectar à API. Tente novamente." : error.message);
        }
      });
    return () => { active = false; };
  }, [id, navigate, recarregar]);

  if (!avaliacao) {
    return (
      <main className="min-h-screen bg-[#f6f5ff] px-4 py-10 text-[#252344]">
        <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm">
          {erroCarga ? <><p role="alert">{erroCarga}</p><button type="button" onClick={() => { setErroCarga(""); setRecarregar((value) => value + 1); }} className="mt-5 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white">Tentar novamente</button></> : <p role="status">Carregando avaliação...</p>}
          <Link to="/avaliacoes" className="mt-5 block font-semibold text-violet-700">Voltar às avaliações</Link>
        </section>
      </main>
    );
  }

  const questao = avaliacao.questions[questaoAtual];
  const respondidas = Object.keys(respostas).length;
  const progresso = (respondidas / avaliacao.questions.length) * 100;

  function selecionarResposta(indice) {
    setRespostas((atuais) => ({
      ...atuais,
      [questao.id]: indice,
    }));
  }

  async function finalizarAvaliacao() {
    if (enviando || bloqueada || respondidas !== avaliacao.questions.length) return;
    setErroEnvio("");
    setEnviando(true);
    try {
      const answers = avaliacao.questions.map((item) => ({ questionId: item.id, selectedOptionIndex: respostas[item.id] }));
      setResultado(await enviarRespostas(id, answers));
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        logout();
        navigate("/login", { replace: true });
      } else {
        setErroEnvio(error instanceof TypeError ? "Falha de conexão. Suas respostas foram preservadas; tente enviar novamente." : error.message);
        setBloqueada([400, 404, 409].includes(error.status));
      }
    } finally {
      setEnviando(false);
    }
  }

  if (resultado) {
    return (
      <main className="min-h-screen bg-[#f6f5ff] px-4 py-10 text-[#252344]">
        <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <FiCheckCircle className="mx-auto mb-4 text-5xl text-violet-600" />
          <h1 className="text-2xl font-bold">Avaliação finalizada!</h1>
          <p className="mt-3 text-gray-600">
            Suas respostas e sua pontuação foram salvas.
          </p>
          <p className="mt-5 text-lg font-semibold">
            Você acertou {resultado.score} de {resultado.totalQuestions} questões!
          </p>

          <div className="mt-5 rounded-xl bg-violet-50 p-5">
            <p className="text-sm text-violet-700">
              Pontos conquistados nesta avaliação
            </p>

            <p className="mt-2 text-3xl font-bold text-violet-700">
              +{resultado.pointsEarned} pontos
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Você ganhou 10 pontos por questão correta.
            </p>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Correção realizada pelo servidor. Os pontos foram adicionados à sua conta.
          </p>
          <Link
            to="/avaliacoes"
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
          >
            Voltar às avaliações
          </Link>
          <Link to="/desempenho" className="mt-4 block font-semibold text-violet-700">Ver meu desempenho</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f5ff] px-4 py-6 text-[#252344] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/avaliacoes"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-violet-700"
        >
          <FiArrowLeft />
          Voltar às avaliações
        </Link>

        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-violet-700">
              EDUQUEST · AVALIAÇÃO
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              {avaliacao.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {avaliacao.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
            <FiClock className="text-violet-600" />
            <span>Prazo: {new Date(avaliacao.deadline).toLocaleString("pt-BR")}</span>
          </div>
        </header>

        <section aria-busy={enviando} className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-violet-700">
              Questão {questaoAtual + 1} de {avaliacao.questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {respondidas} respondida(s)
            </span>
          </div>

          <div
            className="mb-8 h-2 overflow-hidden rounded-full bg-violet-100"
            role="progressbar"
            aria-valuenow={progresso}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso das respostas"
          >
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>

          <h2 className="text-lg font-semibold leading-relaxed sm:text-xl">
            {questao.prompt}
          </h2>

          <div className="mt-6 space-y-3">
            {questao.options.map((alternativa, indice) => {
              const selecionada = respostas[questao.id] === indice;

              return (
                <button
                  key={indice}
                  type="button"
                  disabled={enviando || bloqueada}
                  onClick={() => selecionarResposta(indice)}
                  aria-pressed={selecionada}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${selecionada
                    ? "border-violet-600 bg-violet-50 text-violet-900"
                    : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
                    }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${selecionada
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-gray-300 text-gray-600"
                      }`}
                  >
                    {String.fromCharCode(65 + indice)}
                  </span>
                  <span>{alternativa}</span>
                </button>
              );
            })}
          </div>

          {erroEnvio && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{erroEnvio}</p>}
          {respondidas !== avaliacao.questions.length && <p className="mt-5 text-sm text-gray-600">Responda todas as questões para finalizar a avaliação.</p>}
          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                setQuestaoAtual((atual) => Math.max(0, atual - 1))
              }
              disabled={questaoAtual === 0 || enviando || bloqueada}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiArrowLeft />
              Anterior
            </button>

            {questaoAtual < avaliacao.questions.length - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setQuestaoAtual((atual) =>
                    Math.min(avaliacao.questions.length - 1, atual + 1),
                  )
                }
                disabled={enviando || bloqueada}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-40"
              >
                Próxima questão
                <FiArrowRight />
              </button>
            ) : (
              <button
                type="button"
                onClick={finalizarAvaliacao}
                disabled={enviando || bloqueada || respondidas !== avaliacao.questions.length}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiFlag />
                {enviando ? "Enviando..." : "Finalizar avaliação"}
              </button>
            )}
          </div>
        </section>

        <p className="mt-4 text-center text-xs text-gray-500">
          Uma tentativa por avaliação. As respostas só são salvas ao finalizar com sucesso.
        </p>
      </div>
    </main>
  );
}

export default StudentExam;
