import { useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { logout } from "../services/authService.js";
import { buscarMinhasAvaliacoes, buscarQuestoes, buscarTentativas, criarAvaliacao, desativarAvaliacao } from "../services/examService.js";
import EvaluationCard from "../components/EvaluationCard";

function Icon({ name, size = 18 }) {
  const icons = {
    home: (
      <path
        d="M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 4.5V3h6v1.5M8.5 9h7M8.5 13h7M8.5 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v4.5a4 4 0 0 1-8 0V4Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 6H4.5v2a3.5 3.5 0 0 0 3.5 3.5M16 6h3.5v2a3.5 3.5 0 0 1-3.5 3.5M12 13v4M8.5 21h7M10 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9.5 9a2.6 2.6 0 1 1 4.2 2c-1 .8-1.7 1.1-1.7 2.4M12 16.8v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    back: <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    users: (
      <>
        <path d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M17 11a3 3 0 0 0 0-6M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m7 15 3-4 3 2 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
    plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
    trash: (
      <path d="M5 7h14M10 11v6M14 11v6M9 7V4h6v3M7 7l1 14h8l1-14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.08-.02a1.7 1.7 0 0 0-1.8.5l-.05.06h-3.4l-.04-.08a1.7 1.7 0 0 0-1.55-1.02 1.7 1.7 0 0 0-.9.26l-.08.05-2.94-1.7.02-.08a1.7 1.7 0 0 0-.5-1.8l-.06-.05v-3.4l.08-.04a1.7 1.7 0 0 0 .76-2.45l-.05-.08 1.7-2.94.08.02a1.7 1.7 0 0 0 1.8-.5l.05-.06h3.4l.04.08a1.7 1.7 0 0 0 2.45.76l.08-.05 2.94 1.7-.02.08a1.7 1.7 0 0 0 .5 1.8l.06.05v3.4l-.08.04A1.7 1.7 0 0 0 19.4 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </>
    ),
    bell: <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    save: (
      <>
        <path d="M5 4h12l2 2v14H5V4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 4v5h7V4M8 20v-6h8v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </>
    ),
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {icons[name] ?? null}
    </svg>
  );
}

function Professor() {
  const user = useLoaderData();
  const navigate = useNavigate();
  const [pagina, setPagina] = useState("avaliacoes");
  const [abaConfiguracao, setAbaConfiguracao] = useState("perfil");
  const [mensagemConfiguracao, setMensagemConfiguracao] = useState("");

  const [tamanhoTexto, setTamanhoTexto] = useState(() => {
    try {
      return localStorage.getItem("eduquest-tamanho-texto") || "padrao";
    } catch {
      return "padrao";
    }
  });

  useEffect(() => {
    const tamanhos = { pequeno: "14px", padrao: "16px", grande: "18px" };
    document.documentElement.style.fontSize = tamanhos[tamanhoTexto] || "16px";

    try {
      localStorage.setItem("eduquest-tamanho-texto", tamanhoTexto);
    } catch {
      // a preferência continua funcionando durante esta sessão
    }

    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [tamanhoTexto]);

  const [perfil, setPerfil] = useState(() => {
    const atual = { nome: user.name, email: user.email, disciplina: "Tecnologia", instituicao: "" };
    try {
      const salvo = JSON.parse(localStorage.getItem("eduquest-perfil-professor"));
      return {
        ...atual,
        disciplina: typeof salvo?.disciplina === "string" ? salvo.disciplina : atual.disciplina,
        instituicao: typeof salvo?.instituicao === "string" ? salvo.instituicao : atual.instituicao,
      };
    } catch {
      return atual;
    }
  });

  const [preferencias, setPreferencias] = useState(() => {
    try {
      const salvo = localStorage.getItem("eduquest-preferencias");
      return salvo ? JSON.parse(salvo) : { idioma: "Português (Brasil)", itensPorPagina: "10", mostrarDicas: true };
    } catch {
      return { idioma: "Português (Brasil)", itensPorPagina: "10", mostrarDicas: true };
    }
  });

  const [notificacoes, setNotificacoes] = useState(() => {
    try {
      const salvo = localStorage.getItem("eduquest-notificacoes");
      return salvo ? JSON.parse(salvo) : { novasTentativas: true, lembretes: true, novidades: false };
    } catch {
      return { novasTentativas: true, lembretes: true, novidades: false };
    }
  });

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [faqAberto, setFaqAberto] = useState(null);
  const [modoCriacao, setModoCriacao] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [bancoQuestoes, setBancoQuestoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroDados, setErroDados] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [erroCriacao, setErroCriacao] = useState("");
  const [mensagemAvaliacao, setMensagemAvaliacao] = useState("");
  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);
  const [tentativas, setTentativas] = useState([]);
  const [carregandoTentativas, setCarregandoTentativas] = useState(false);
  const [erroTentativas, setErroTentativas] = useState("");
  const tentativasRequest = useRef(0);
  const [avaliacaoParaDesativar, setAvaliacaoParaDesativar] = useState(null);
  const [desativando, setDesativando] = useState(false);
  const [erroDesativacao, setErroDesativacao] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([buscarMinhasAvaliacoes(), buscarQuestoes()])
      .then(([exams, questions]) => {
        if (!active) return;
        setAvaliacoes(exams);
        setBancoQuestoes(questions);
      })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) {
          logout();
          navigate("/login", { replace: true });
        } else {
          setErroDados("Não foi possível carregar as avaliações e questões. Tente novamente.");
        }
      })
      .finally(() => { if (active) setCarregando(false); });
    return () => { active = false; };
  }, [navigate, atualizacao]);

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    titulo: "",
    descricao: "",
    prazo: "",
  });

  const [questoesSelecionadas, setQuestoesSelecionadas] = useState([]);
  const [buscaQuestao, setBuscaQuestao] = useState("");

  const mudarPagina = (novaPagina) => {
    if (salvando) return;
    setPagina(novaPagina);
    setModoCriacao(false);
  };

  const abrirCriacao = () => {
    setModoCriacao(true);
    setMensagemAvaliacao("");
    setErroCriacao("");
    setPagina("avaliacoes");
  };

  const carregarTentativas = async (avaliacao) => {
    const requestId = ++tentativasRequest.current;
    setCarregandoTentativas(true);
    setErroTentativas("");
    try {
      const resultados = await buscarTentativas(avaliacao.id);
      if (tentativasRequest.current === requestId) setTentativas(resultados);
    } catch (error) {
      if (tentativasRequest.current !== requestId) return;
      if (error.status === 401 || error.status === 403) {
        logout();
        navigate("/login", { replace: true });
      } else {
        setErroTentativas(error instanceof TypeError ? "Não foi possível conectar à API. Tente novamente." : error.message);
      }
    } finally {
      if (tentativasRequest.current === requestId) setCarregandoTentativas(false);
    }
  };

  const abrirResultados = (avaliacao) => {
    setAvaliacaoSelecionada(avaliacao);
    setPagina("resultados");
    carregarTentativas(avaliacao);
  };

  const voltarDosResultados = () => {
    tentativasRequest.current += 1;
    setAvaliacaoSelecionada(null);
    setTentativas([]);
    setErroTentativas("");
    setPagina("avaliacoes");
  };

  const abrirDesativacao = (avaliacao) => {
    setAvaliacaoParaDesativar(avaliacao);
    setErroDesativacao("");
  };

  const confirmarDesativacao = async () => {
    if (!avaliacaoParaDesativar || desativando) return;
    setDesativando(true);
    setErroDesativacao("");
    try {
      const atualizada = await desativarAvaliacao(avaliacaoParaDesativar.id);
      setAvaliacoes((atuais) => atuais.map((avaliacao) => avaliacao.id === atualizada.id ? atualizada : avaliacao));
      setAvaliacaoSelecionada((atual) => atual?.id === atualizada.id ? atualizada : atual);
      setAvaliacaoParaDesativar(null);
      setMensagemAvaliacao("Avaliação desativada com sucesso.");
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        logout();
        navigate("/login", { replace: true });
      } else {
        setErroDesativacao(error instanceof TypeError ? "Não foi possível conectar à API. Tente novamente." : error.message);
      }
    } finally {
      setDesativando(false);
    }
  };

  const voltarParaAvaliacoes = () => {
    if (salvando) return;
    setModoCriacao(false);
  };

  const alternarQuestaoSelecionada = (id) => {
    setQuestoesSelecionadas((selecionadas) =>
      selecionadas.includes(id)
        ? selecionadas.filter((questaoId) => questaoId !== id)
        : [...selecionadas, id]
    );
  };

  const salvarAvaliacao = async (event) => {
    event.preventDefault();
    if (salvando || carregando || erroDados) return;
    setErroCriacao("");
    setSalvando(true);
    try {
      const nova = await criarAvaliacao({
        title: novaAvaliacao.titulo,
        description: novaAvaliacao.descricao,
        deadline: novaAvaliacao.prazo,
        questionIds: questoesSelecionadas,
      });
      setAvaliacoes((atuais) => [nova, ...atuais]);
      setNovaAvaliacao({ titulo: "", descricao: "", prazo: "" });
      setQuestoesSelecionadas([]);
      setBuscaQuestao("");
      setModoCriacao(false);
      setMensagemAvaliacao("Avaliação criada com sucesso!");
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        logout();
        navigate("/login", { replace: true });
      } else {
        setErroCriacao(error instanceof TypeError ? "Não foi possível conectar à API. Seus dados foram preservados." : error.message);
      }
    } finally {
      setSalvando(false);
    }
  };

  const salvarNoNavegador = (chave, valor, mensagem) => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      setMensagemConfiguracao(mensagem);
    } catch {
      setMensagemConfiguracao("Não foi possível salvar os dados neste navegador.");
    }
  };

  const questoesFiltradas = bancoQuestoes.filter((questao) =>
    questao.prompt.toLocaleLowerCase("pt-BR").includes(buscaQuestao.toLocaleLowerCase("pt-BR").trim())
  );

  return (
    <div className="min-h-screen bg-[#a69cf3] text-[#29263d]">
      {/* navbar */}
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/95 shadow-[0_4px_20px_rgba(49,42,105,0.08)] backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <button type="button" onClick={() => mudarPagina("inicio")} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7665e8] text-sm font-bold text-white shadow-[0_5px_14px_rgba(118,101,232,0.35)]">E</span>
            <span className="text-lg font-bold tracking-tight">EduQuest</span>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {[
              ["inicio", "Início", "home"],
              ["avaliacoes", "Avaliações", "clipboard"],
              ["leaderboard", "Leaderboard", "trophy"],
              ["faq", "FAQ", "help"],
              ["configuracoes", "Configurações", "settings"],
            ].map(([id, label, icon]) => (
              <button type="button" key={id} onClick={() => mudarPagina(id)} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${pagina === id ? "bg-[#eeeaff] text-[#6b59df] shadow-sm" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}>
                <Icon name={icon} size={16} />{label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-[#eeeaff] px-3 py-1.5 text-xs font-semibold text-[#6b59df] sm:block">
              {user.name}
            </span>
            <div
              title={user.name}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8574f0] to-[#6755d7] text-xs font-bold text-white shadow-[0_5px_14px_rgba(118,101,232,0.3)]"
            >
              {user.name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((nome) => nome[0])
                .join("")
                .toUpperCase() || "PR"}
            </div>
            <button type="button" onClick={() => { logout(); navigate("/login", { replace: true }); }} className="rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500">Sair</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        {carregando && <p role="status" className="mb-5 rounded-xl bg-white p-5">Carregando avaliações e questões...</p>}
        {erroDados && <div role="alert" className="mb-5 rounded-xl bg-white p-5"><p>{erroDados}</p><button type="button" onClick={() => { setCarregando(true); setErroDados(""); setAtualizacao((value) => value + 1); }} className="mt-3 font-semibold text-[#7665e8]">Tentar novamente</button></div>}
        {mensagemAvaliacao && <p role="status" className="mb-5 rounded-xl bg-white p-5">{mensagemAvaliacao}</p>}
        {/* início */}
        {pagina === "inicio" && (
          <section className="space-y-5">
            <div className="overflow-hidden rounded-[24px] bg-white p-7 shadow-[0_12px_35px_rgba(57,49,122,0.12)]">
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eeeaff] px-3 py-1.5 text-xs font-semibold text-[#6b59df]"><span className="h-1.5 w-1.5 rounded-full bg-[#7665e8]" />painel do professor</div>
                  <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao EduQuest!</h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">Acompanhe suas avaliações e visualize o desempenho dos alunos em um só lugar.</p>
                </div>
                <button type="button" onClick={() => mudarPagina("avaliacoes")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-5 py-3 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(118,101,232,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#6958dc]"><Icon name="clipboard" size={17} />Ver avaliações<Icon name="arrow" size={16} /></button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { titulo: "Avaliações", valor: carregando || erroDados ? "-" : avaliacoes.length, icon: "clipboard" },
                { titulo: "Questões disponíveis", valor: carregando || erroDados ? "-" : bancoQuestoes.length, icon: "clipboard" },
              ].map((item) => (
                <div key={item.titulo} className="rounded-[22px] bg-white p-5 shadow-[0_9px_25px_rgba(57,49,122,0.1)] transition-all hover:-translate-y-1">
                  <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-gray-500">{item.titulo}</p><p className="mt-2 text-3xl font-bold tracking-tight">{item.valor}</p></div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeeaff] text-[#7665e8]"><Icon name={item.icon} size={20} /></span></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* criação da avaliação */}
        {pagina === "avaliacoes" && modoCriacao && (
          <section>
            <button type="button" onClick={voltarParaAvaliacoes} className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-[0_6px_18px_rgba(57,49,122,0.08)] transition hover:-translate-x-0.5 hover:text-[#7665e8]"><Icon name="back" size={16} />Voltar para avaliações</button>
            <div className="mb-5 rounded-[24px] bg-white p-7 shadow-[0_12px_32px_rgba(57,49,122,0.1)]">
              <div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7665e8]"><Icon name="plus" size={24} /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-[#7665e8]">professor</p><h1 className="text-2xl font-bold">Criar avaliação</h1><p className="mt-1 text-sm text-gray-500">Crie uma nova avaliação para seus alunos.</p></div></div>
            </div>
            <form onSubmit={salvarAvaliacao} aria-busy={salvando}>
            <fieldset disabled={salvando || carregando || Boolean(erroDados)} className="space-y-5">
              <legend className="sr-only">Criar avaliação</legend>
              <div className="rounded-[22px] bg-white p-6 shadow-[0_10px_28px_rgba(57,49,122,0.1)]">
                <div className="mb-5"><h2 className="text-lg font-bold">Informações da avaliação</h2><p className="mt-1 text-sm text-gray-500">Preencha as informações básicas antes de adicionar as questões.</p></div>
                <div className="grid gap-5">
                  <div><label htmlFor="titulo-avaliacao" className="mb-2 block text-sm font-semibold">Título da avaliação</label><input id="titulo-avaliacao" type="text" value={novaAvaliacao.titulo} onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, titulo: e.target.value })} placeholder="Ex.: Fundamentos de HTML e CSS" className="w-full rounded-xl border border-gray-200 bg-[#faf9ff] px-4 py-3 text-sm outline-none transition focus:border-[#7665e8] focus:bg-white focus:ring-4 focus:ring-[#7665e8]/10" /></div>
                  <div><label htmlFor="descricao-avaliacao" className="mb-2 block text-sm font-semibold">Descrição</label><textarea id="descricao-avaliacao" rows={3} value={novaAvaliacao.descricao} onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, descricao: e.target.value })} placeholder="Descreva brevemente o conteúdo da avaliação." className="w-full resize-none rounded-xl border border-gray-200 bg-[#faf9ff] px-4 py-3 text-sm outline-none transition focus:border-[#7665e8] focus:bg-white focus:ring-4 focus:ring-[#7665e8]/10" /></div>
                  <div><label htmlFor="prazo-avaliacao" className="mb-2 block text-sm font-semibold">Prazo para responder</label><input id="prazo-avaliacao" required type="datetime-local" value={novaAvaliacao.prazo} onChange={(e) => setNovaAvaliacao({ ...novaAvaliacao, prazo: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-[#faf9ff] px-4 py-3 text-sm outline-none transition focus:border-[#7665e8] focus:ring-4 focus:ring-[#7665e8]/10" /><p className="mt-2 text-xs text-gray-500">Informe uma data futura no seu horário local.</p></div>
                </div>
              </div>

              <div className="rounded-[22px] bg-white p-6 shadow-[0_10px_28px_rgba(57,49,122,0.1)]">
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 className="text-lg font-bold">Selecionar questões</h2><p className="mt-1 text-sm text-gray-500">Escolha as perguntas já cadastradas no banco de questões do EduQuest.</p></div><span className="w-fit shrink-0 rounded-full bg-[#eeeaff] px-3 py-1.5 text-xs font-bold text-[#6b59df]">{questoesSelecionadas.length} selecionada{questoesSelecionadas.length === 1 ? "" : "s"}</span></div>
                <div className="mb-4"><label htmlFor="buscar-questao" className="mb-2 block text-sm font-semibold">Buscar questão</label><input id="buscar-questao" type="search" value={buscaQuestao} onChange={(e) => setBuscaQuestao(e.target.value)} placeholder="Pesquise pelo enunciado..." className="w-full rounded-xl border border-gray-200 bg-[#faf9ff] px-4 py-3 text-sm outline-none transition focus:border-[#7665e8] focus:bg-white focus:ring-4 focus:ring-[#7665e8]/10" /></div>
                <div className="space-y-3">
                  {questoesFiltradas.map((questao) => {
                    const selecionada = questoesSelecionadas.includes(questao.id);
                    return (
                      <label key={questao.id} className={`block cursor-pointer rounded-2xl border p-4 transition ${selecionada ? "border-[#7665e8] bg-[#f5f2ff] ring-2 ring-[#7665e8]/10" : "border-gray-200 bg-white hover:border-[#c9c2fa] hover:bg-[#faf9ff]"}`}>
                        <span className="flex items-start gap-3">
                          <input type="checkbox" checked={selecionada} onChange={() => alternarQuestaoSelecionada(questao.id)} className="mt-1 h-4 w-4 shrink-0 accent-[#7665e8]" />
                          <span className="min-w-0 flex-1">
                            <span className="font-semibold text-[#29263d]">{questao.prompt}</span>
                            <span className="mt-3 grid gap-2 sm:grid-cols-2">
                              {questao.options.map((alternativa, index) => <span key={index} className={`rounded-lg border px-3 py-2 text-xs ${selecionada && index === questao.correctOptionIndex ? "border-[#b9afef] bg-white text-[#5e4acb]" : "border-gray-100 bg-white text-gray-600"}`}><span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>{alternativa}</span>)}
                            </span>
                          </span>
                        </span>
                      </label>
                    );
                  })}
                  {!carregando && !erroDados && questoesFiltradas.length === 0 && <div className="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center"><p className="text-sm font-semibold text-gray-700">Nenhuma questão encontrada</p><p className="mt-1 text-sm text-gray-500">{bancoQuestoes.length ? "Tente buscar por outro termo." : "O banco de questões ainda está vazio."}</p></div>}
                </div>
                <p className="mt-4 text-xs leading-5 text-gray-500">Selecione uma ou mais questões do banco compartilhado. O gabarito é exibido somente na área do professor.</p>
              </div>

              {erroCriacao && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{erroCriacao}</p>}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={voltarParaAvaliacoes} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-600 shadow-[0_6px_18px_rgba(57,49,122,0.08)] transition hover:bg-gray-50">Cancelar</button><button type="submit" disabled={bancoQuestoes.length === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-6 py-3 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(118,101,232,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#6958dc] disabled:cursor-not-allowed disabled:opacity-60"><Icon name="save" size={17} />{salvando ? "Salvando..." : "Salvar avaliação"}</button></div>
            </fieldset>
            </form>
          </section>
        )}

        {/* lista de avaliações */}
        {pagina === "avaliacoes" && !modoCriacao && (
          <section>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#6b59df]"><Icon name="clipboard" size={15} />professor</div><h1 className="text-3xl font-bold tracking-tight">Minhas avaliações</h1><p className="mt-2 text-sm text-gray-500">Visualize suas avaliações e acompanhe as tentativas dos alunos.</p></div><button type="button" onClick={abrirCriacao} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-5 py-3 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(118,101,232,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#6958dc]"><Icon name="plus" size={17} />Criar avaliação</button></div>
            <div className="grid gap-5 md:grid-cols-2">
              {avaliacoes.map((avaliacao) => <EvaluationCard key={avaliacao.id} avaliacao={avaliacao} Icon={Icon} onViewResults={abrirResultados} onDeactivate={abrirDesativacao} />)}
            </div>
            {!carregando && !erroDados && avaliacoes.length === 0 && <p className="rounded-xl bg-white p-6">Você ainda não criou avaliações.</p>}
          </section>
        )}

        {pagina === "resultados" && avaliacaoSelecionada && (
          <section>
            <button type="button" onClick={voltarDosResultados} className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-[0_6px_18px_rgba(57,49,122,0.08)] transition hover:-translate-x-0.5 hover:text-[#7665e8]"><Icon name="back" size={16} />Voltar para avaliações</button>
            <div className="mb-5 rounded-[24px] bg-white p-7 shadow-[0_12px_32px_rgba(57,49,122,0.1)]"><p className="text-xs font-semibold uppercase tracking-wide text-[#7665e8]">resultados da avaliação</p><h1 className="mt-1 text-2xl font-bold">{avaliacaoSelecionada.title}</h1><p className="mt-2 text-sm text-gray-500">Tentativas enviadas pelos alunos nesta avaliação.</p></div>
            {carregandoTentativas && <p role="status" className="rounded-xl bg-white p-5">Carregando tentativas...</p>}
            {erroTentativas && <div role="alert" className="rounded-xl bg-white p-5"><p>{erroTentativas}</p><button type="button" onClick={() => carregarTentativas(avaliacaoSelecionada)} className="mt-3 font-semibold text-[#7665e8]">Tentar novamente</button></div>}
            {!carregandoTentativas && !erroTentativas && tentativas.length === 0 && <p className="rounded-xl bg-white p-6">Nenhum aluno realizou esta avaliação ainda.</p>}
            {!carregandoTentativas && !erroTentativas && tentativas.length > 0 && <div className="overflow-x-auto rounded-[22px] bg-white shadow-[0_10px_28px_rgba(57,49,122,0.1)]"><table className="min-w-full text-left text-sm"><thead className="border-b border-gray-100 bg-[#faf9ff] text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-6 py-4">Aluno</th><th className="px-6 py-4">Acertos</th><th className="px-6 py-4">Nota</th><th className="px-6 py-4">Enviada em</th></tr></thead><tbody>{tentativas.map((tentativa) => <tr key={tentativa.id} className="border-b border-gray-100 last:border-0"><td className="px-6 py-4 font-semibold">{tentativa.studentName}</td><td className="px-6 py-4">{tentativa.score} de {tentativa.totalQuestions}</td><td className="px-6 py-4">{tentativa.totalQuestions > 0 ? (tentativa.score / tentativa.totalQuestions * 10).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "0"}</td><td className="px-6 py-4 text-gray-500">{new Date(tentativa.createdAt).toLocaleString("pt-BR")}</td></tr>)}</tbody></table></div>}
          </section>
        )}

        {avaliacaoParaDesativar && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#29263d]/40 p-4" role="dialog" aria-modal="true" aria-labelledby="titulo-desativar-avaliacao"><div className="w-full max-w-md rounded-[22px] bg-white p-6 shadow-2xl"><h2 id="titulo-desativar-avaliacao" className="text-xl font-bold">Desativar avaliação?</h2><p className="mt-3 text-sm leading-6 text-gray-600">Alunos não poderão mais realizar <strong>{avaliacaoParaDesativar.title}</strong>. As tentativas já enviadas serão preservadas.</p>{erroDesativacao && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{erroDesativacao}</p>}<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={desativando} onClick={() => setAvaliacaoParaDesativar(null)} className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 disabled:opacity-50">Cancelar</button><button type="button" disabled={desativando} onClick={confirmarDesativacao} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{desativando ? "Desativando..." : "Desativar"}</button></div></div></div>}

        {/* leaderboard */}
        {pagina === "leaderboard" && (
          <section>
            <div className="mb-5 rounded-[24px] bg-white p-7 shadow-[0_12px_32px_rgba(57,49,122,0.1)]"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0d4] text-[#e49a17]"><Icon name="trophy" size={23} /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-[#7665e8]">desempenho</p><h1 className="text-2xl font-bold">Leaderboard</h1></div></div><p className="mt-3 text-sm text-gray-500">Acompanhe o desempenho dos alunos nas avaliações.</p></div>
            <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_28px_rgba(57,49,122,0.1)]">{[["Maria Silva", "9,4"], ["Ana Oliveira", "9,1"], ["João Santos", "8,7"], ["Carlos Souza", "7,8"]].map((aluno, index) => <div key={aluno[0]} className="flex items-center justify-between border-b border-gray-100 px-6 py-5 transition hover:bg-[#faf9ff]"><div className="flex items-center gap-4"><span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${index === 0 ? "bg-[#fff0d4] text-[#d8900f]" : index === 1 ? "bg-[#eeeaff] text-[#7665e8]" : "bg-gray-100 text-gray-500"}`}>{index + 1}</span><div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8a79ef] to-[#6958d9] text-xs font-bold text-white">{aluno[0].split(" ").map((nome) => nome[0]).join("")}</div><span className="font-semibold">{aluno[0]}</span></div><span className="rounded-full bg-[#eeeaff] px-3 py-1.5 text-sm font-bold text-[#6b59df]">{aluno[1]}</span></div>)}</div>
          </section>
        )}

        {/* configurações */}
        {pagina === "configuracoes" && (
          <section className="space-y-5">
            <div className="rounded-[24px] bg-white p-7 shadow-[0_12px_32px_rgba(57,49,122,0.1)]"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7665e8]"><Icon name="settings" size={23} /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-[#7665e8]">sua conta</p><h1 className="text-2xl font-bold">Configurações</h1></div></div><p className="mt-3 text-sm text-gray-500">Personalize seu perfil e escolha como deseja usar o EduQuest.</p></div>
            {mensagemConfiguracao && <div role="status" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"><span>{mensagemConfiguracao}</span><button type="button" onClick={() => setMensagemConfiguracao("")} aria-label="Fechar mensagem" className="ml-3 text-emerald-800">✕</button></div>}
            <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
              <aside className="h-fit rounded-[22px] bg-white p-3 shadow-[0_8px_24px_rgba(57,49,122,0.08)]">{[["perfil", "Perfil", "users"], ["preferencias", "Preferências", "settings"], ["notificacoes", "Notificações", "bell"], ["seguranca", "Segurança", "shield"]].map(([id, label, icon]) => <button type="button" key={id} onClick={() => { setAbaConfiguracao(id); setMensagemConfiguracao(""); }} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${abaConfiguracao === id ? "bg-[#eeeaff] text-[#6b59df]" : "text-gray-600 hover:bg-gray-50"}`}><Icon name={icon} size={18} />{label}</button>)}</aside>
              <div className="rounded-[22px] bg-white p-6 shadow-[0_8px_24px_rgba(57,49,122,0.08)] sm:p-8">
                {abaConfiguracao === "perfil" && <form onSubmit={(e) => { e.preventDefault(); if (!perfil.nome.trim() || !perfil.email.trim()) { setMensagemConfiguracao("Preencha seu nome e e-mail."); return; } salvarNoNavegador("eduquest-perfil-professor", perfil, "Perfil salvo neste navegador."); }}>
                  <h2 className="text-xl font-bold">Informações do perfil</h2><p className="mt-1 text-sm text-gray-500">Esses dados ajudam a identificar sua conta no sistema.</p>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-gray-700">Nome completo<input required value={perfil.nome} onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none transition focus:border-[#8574f0] focus:ring-4 focus:ring-[#eeeaff]" placeholder="Seu nome" /></label>
                    <label className="block text-sm font-semibold text-gray-700">E-mail<input required type="email" value={perfil.email} onChange={(e) => setPerfil({ ...perfil, email: e.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none transition focus:border-[#8574f0] focus:ring-4 focus:ring-[#eeeaff]" placeholder="voce@exemplo.com" /></label>
                    <label className="block text-sm font-semibold text-gray-700">Área / disciplina<input value={perfil.disciplina} onChange={(e) => setPerfil({ ...perfil, disciplina: e.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-[#8574f0] focus:ring-4 focus:ring-[#eeeaff]" placeholder="Ex.: Tecnologia" /></label>
                    <label className="block text-sm font-semibold text-gray-700">Instituição<input value={perfil.instituicao} onChange={(e) => setPerfil({ ...perfil, instituicao: e.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-[#8574f0] focus:ring-4 focus:ring-[#eeeaff]" placeholder="Nome da instituição" /></label>
                  </div>
                  <div className="mt-7 flex justify-end"><button type="submit" className="rounded-xl bg-[#7665e8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6958dc]">Salvar perfil</button></div>
                </form>}

                {abaConfiguracao === "preferencias" && <form onSubmit={(e) => { e.preventDefault(); salvarNoNavegador("eduquest-preferencias", preferencias, "Preferências salvas neste navegador."); }}>
                  <h2 className="text-xl font-bold">Preferências do sistema</h2><p className="mt-1 text-sm text-gray-500">Ajuste algumas opções de exibição da plataforma.</p>
                  <div className="mt-6 space-y-6">
                    <label className="block text-sm font-semibold text-gray-700">Idioma da interface<select value={preferencias.idioma} onChange={(e) => setPreferencias({ ...preferencias, idioma: e.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-normal outline-none focus:border-[#8574f0] sm:max-w-md"><option>Português (Brasil)</option><option>English</option><option>Español</option></select><span className="mt-1 block text-xs font-normal text-gray-400">A seleção fica salva, mas a tradução completa ainda depende de implementação.</span></label>
                    <div className="rounded-2xl border border-[#eeeaff] p-4 sm:max-w-xl"><label className="block text-sm font-semibold text-gray-700" htmlFor="tamanho-texto">Acessibilidade: tamanho do texto</label><p className="mt-1 text-sm font-normal text-gray-500">Escolha o tamanho mais confortável para ler. A alteração se aplica à interface do EduQuest.</p><div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Tamanho do texto">{[["pequeno", "Pequeno", "text-sm"], ["padrao", "Padrão", "text-base"], ["grande", "Grande", "text-lg"]].map(([valor, rotulo, classe]) => <button type="button" key={valor} aria-pressed={tamanhoTexto === valor} onClick={() => setTamanhoTexto(valor)} className={`rounded-xl border px-3 py-3 font-semibold transition ${classe} ${tamanhoTexto === valor ? "border-[#7665e8] bg-[#eeeaff] text-[#6b59df] ring-2 ring-[#eeeaff]" : "border-gray-200 text-gray-600 hover:border-[#c9c1ff] hover:bg-gray-50"}`}>{rotulo}</button>)}</div><p className="mt-3 text-xs font-normal text-gray-400">Sua escolha fica salva neste navegador e é aplicada automaticamente.</p></div>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 p-4"><input type="checkbox" checked={preferencias.mostrarDicas} onChange={(e) => setPreferencias({ ...preferencias, mostrarDicas: e.target.checked })} className="mt-1 h-4 w-4 accent-[#7665e8]" /><span><span className="block text-sm font-semibold">Exibir dicas de utilização</span><span className="mt-1 block text-sm font-normal text-gray-500">Permite manter dicas e orientações visíveis quando disponíveis.</span></span></label>
                  </div><div className="mt-7 flex justify-end"><button type="submit" className="rounded-xl bg-[#7665e8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6958dc]">Salvar preferências</button></div>
                </form>}

                {abaConfiguracao === "notificacoes" && <form onSubmit={(e) => { e.preventDefault(); salvarNoNavegador("eduquest-notificacoes", notificacoes, "Preferências de notificação salvas neste navegador."); }}>
                  <h2 className="text-xl font-bold">Notificações</h2><p className="mt-1 text-sm text-gray-500">Escolha quais avisos gostaria de receber.</p>
                  <div className="mt-6 divide-y divide-gray-100">{[["novasTentativas", "Novas tentativas", "Avisar quando alunos concluírem avaliações."], ["lembretes", "Lembretes de avaliações", "Receber lembretes sobre atividades e avaliações."], ["novidades", "Novidades do EduQuest", "Receber informações sobre atualizações da plataforma."]].map(([id, titulo, descricao]) => <label key={id} className="flex cursor-pointer items-center justify-between gap-4 py-5"><span><span className="block text-sm font-semibold">{titulo}</span><span className="mt-1 block text-sm text-gray-500">{descricao}</span></span><input type="checkbox" checked={Boolean(notificacoes[id])} onChange={(e) => setNotificacoes({ ...notificacoes, [id]: e.target.checked })} className="h-5 w-5 shrink-0 accent-[#7665e8]" /></label>)}</div>
                  <div className="mt-5 flex justify-end"><button type="submit" className="rounded-xl bg-[#7665e8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6958dc]">Salvar notificações</button></div>
                </form>}

                {abaConfiguracao === "seguranca" && <form onSubmit={(e) => { e.preventDefault(); if (!senhaAtual || !novaSenha || !confirmarSenha) { setMensagemConfiguracao("Preencha todos os campos de senha."); return; } if (novaSenha.length < 8) { setMensagemConfiguracao("A nova senha deve ter pelo menos 8 caracteres."); return; } if (novaSenha !== confirmarSenha) { setMensagemConfiguracao("A confirmação não corresponde à nova senha."); return; } setMensagemConfiguracao("Validação concluída. A troca real de senha precisa ser conectada ao backend."); setSenhaAtual(""); setNovaSenha(""); setConfirmarSenha(""); }}>
                  <h2 className="text-xl font-bold">Segurança da conta</h2><p className="mt-1 text-sm text-gray-500">Mantenha suas credenciais protegidas.</p>
                  <div className="mt-6 space-y-5 sm:max-w-md">
                    <label className="block text-sm font-semibold text-gray-700">Senha atual<input required type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-[#8574f0] focus:ring-4 focus:ring-[#eeeaff]" placeholder="Digite a senha atual" /></label>
                    <label className="block text-sm font-semibold text-gray-700">Nova senha<input required type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} autoComplete="new-password" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-[#8574f0] focus:ring-4 focus:ring-[#eeeaff]" placeholder="Mínimo de 8 caracteres" /></label>
                    <label className="block text-sm font-semibold text-gray-700">Confirmar nova senha<input required type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} autoComplete="new-password" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:border-[#8574f0] focus:ring-4 focus:ring-[#eeeaff]" placeholder="Digite novamente a nova senha" /></label>
                  </div>
                  <div className="mt-7 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">A tela valida os campos, mas ainda não altera uma senha real. Isso exige autenticação e integração segura com o servidor.</div><div className="mt-6 flex justify-end"><button type="submit" className="rounded-xl bg-[#7665e8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6958dc]">Validar alteração</button></div>
                </form>}
              </div>
            </div>
          </section>
        )}

        {/* faq */}
        {pagina === "faq" && (
          <section>
            <div className="mb-5 rounded-[24px] bg-white p-7 shadow-[0_12px_32px_rgba(57,49,122,0.1)]"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7665e8]"><Icon name="help" size={23} /></div><div><p className="text-xs font-semibold uppercase tracking-wide text-[#7665e8]">central de ajuda</p><h1 className="text-2xl font-bold">Perguntas frequentes</h1></div></div><p className="mt-3 text-sm text-gray-500">Encontre respostas para as principais dúvidas sobre o EduQuest.</p></div>
            <div className="space-y-3">{[
              { pergunta: "Como visualizar os resultados de uma avaliação?", resposta: "Acesse Avaliações e selecione a avaliação desejada para visualizar as tentativas e pontuações dos alunos." },
              { pergunta: "Onde vejo as tentativas dos alunos?", resposta: "Os resultados ficam disponíveis dentro da avaliação selecionada." },
              { pergunta: "O que aparece nos resultados?", resposta: "São apresentados o aluno, número da tentativa, data e pontuação obtida." },
            ].map((item, index) => {
              const aberto = faqAberto === index;
              return <button type="button" key={item.pergunta} aria-expanded={aberto} onClick={() => setFaqAberto(aberto ? null : index)} className="w-full rounded-[20px] bg-white p-5 text-left shadow-[0_7px_22px_rgba(57,49,122,0.08)] transition-all hover:shadow-[0_10px_28px_rgba(57,49,122,0.12)]"><div className="flex items-center justify-between gap-4"><span className="font-semibold">{item.pergunta}</span><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eeeaff] text-[#7665e8] transition-transform ${aberto ? "rotate-180" : ""}`}><Icon name="chevron" size={16} /></span></div>{aberto && <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-6 text-gray-500">{item.resposta}</p>}</button>;
            })}</div>
          </section>
        )}

      </main>
    </div>
  );
}

export default Professor;
