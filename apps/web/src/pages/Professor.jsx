import { useState } from "react";



function Icon({ name, size = 18 }) {

  const icons = {

    home: (

      <>

        <path

          d="M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M9 21v-6h6v6"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

          strokeLinejoin="round"

        />

      </>

    ),



    clipboard: (

      <>

        <rect

          x="5"

          y="4"

          width="14"

          height="17"

          rx="2"

          stroke="currentColor"

          strokeWidth="1.8"

        />

        <path

          d="M9 4.5V3h6v1.5M8.5 9h7M8.5 13h7M8.5 17h4"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

        />

      </>

    ),



    trophy: (

      <>

        <path

          d="M8 4h8v4.5a4 4 0 0 1-8 0V4Z"

          stroke="currentColor"

          strokeWidth="1.8"

        />

        <path

          d="M8 6H4.5v2a3.5 3.5 0 0 0 3.5 3.5M16 6h3.5v2a3.5 3.5 0 0 1-3.5 3.5M12 13v4M8.5 21h7M10 17h4"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

          strokeLinejoin="round"

        />

      </>

    ),



    help: (

      <>

        <circle

          cx="12"

          cy="12"

          r="9"

          stroke="currentColor"

          strokeWidth="1.8"

        />

        <path

          d="M9.5 9a2.6 2.6 0 1 1 4.2 2c-1 .8-1.7 1.1-1.7 2.4M12 16.8v.1"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

        />

      </>

    ),



    arrow: (

      <path

        d="M5 12h14M13 6l6 6-6 6"

        stroke="currentColor"

        strokeWidth="1.8"

        strokeLinecap="round"

        strokeLinejoin="round"

      />

    ),



    back: (

      <path

        d="M19 12H5M11 18l-6-6 6-6"

        stroke="currentColor"

        strokeWidth="1.8"

        strokeLinecap="round"

        strokeLinejoin="round"

      />

    ),



    users: (

      <>

        <path

          d="M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

        />

        <circle

          cx="10"

          cy="8"

          r="3"

          stroke="currentColor"

          strokeWidth="1.8"

        />

        <path

          d="M17 11a3 3 0 0 0 0-6M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

        />

      </>

    ),



    chart: (

      <>

        <path

          d="M4 19V5M4 19h16"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

        />

        <path

          d="m7 15 3-4 3 2 5-6"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

          strokeLinejoin="round"

        />

      </>

    ),



    clock: (

      <>

        <circle

          cx="12"

          cy="12"

          r="8.5"

          stroke="currentColor"

          strokeWidth="1.8"

        />

        <path

          d="M12 7v5l3 2"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

        />

      </>

    ),



    chevron: (

      <path

        d="m6 9 6 6 6-6"

        stroke="currentColor"

        strokeWidth="1.8"

        strokeLinecap="round"

        strokeLinejoin="round"

      />

    ),



    star: (

      <path

        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"

        stroke="currentColor"

        strokeWidth="1.8"

        strokeLinejoin="round"

      />

    ),



    plus: (

      <path

        d="M12 5v14M5 12h14"

        stroke="currentColor"

        strokeWidth="2"

        strokeLinecap="round"

      />

    ),



    trash: (

      <>

        <path

          d="M5 7h14M10 11v6M14 11v6M9 7V4h6v3M7 7l1 14h8l1-14"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinecap="round"

          strokeLinejoin="round"

        />

      </>

    ),



    save: (

      <>

        <path

          d="M5 4h12l2 2v14H5V4Z"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinejoin="round"

        />

        <path

          d="M8 4v5h7V4M8 20v-6h8v6"

          stroke="currentColor"

          strokeWidth="1.8"

          strokeLinejoin="round"

        />

      </>

    ),

  };



  return (

    <svg

      width={size}

      height={size}

      viewBox="0 0 24 24"

      fill="none"

      aria-hidden="true"

    >

      {icons[name]}

    </svg>

  );

}



function Professor() {

  const [pagina, setPagina] = useState("avaliacoes");

  const [avaliacaoSelecionada, setAvaliacaoSelecionada] = useState(null);

  const [faqAberto, setFaqAberto] = useState(null);

  const [modoCriacao, setModoCriacao] = useState(false);
  const [avaliacaoParaExcluir, setAvaliacaoParaExcluir] = useState(null);



  const [avaliacoes, setAvaliacoes] = useState([

    {

      id: 1,

      titulo: "Análise e Desenvolvimento de Sistemas",

      descricao:

        "Avaliação sobre conceitos de desenvolvimento de sistemas.",

      questoes: 10,

      categoria: "Tecnologia",

      dificuldade: "Médio",

      tentativas: [

        {

          aluno: "Maria Silva",

          tentativa: 1,

          pontuacao: 9.0,

          data: "30/09/2026",

        },

        {

          aluno: "João Santos",

          tentativa: 1,

          pontuacao: 7.5,

          data: "29/09/2026",

        },

        {

          aluno: "Ana Oliveira",

          tentativa: 1,

          pontuacao: 8.5,

          data: "29/09/2026",

        },

        {

          aluno: "João Santos",

          tentativa: 2,

          pontuacao: 9.0,

          data: "30/09/2026",

        },

      ],

    },



    {

      id: 2,

      titulo: "Fundamentos de JavaScript",

      descricao:

        "Avaliação sobre lógica e programação em JavaScript.",

      questoes: 15,

      categoria: "Programação",

      dificuldade: "Difícil",

      tentativas: [

        {

          aluno: "Maria Silva",

          tentativa: 1,

          pontuacao: 8.0,

          data: "28/09/2026",

        },

        {

          aluno: "Carlos Souza",

          tentativa: 1,

          pontuacao: 6.5,

          data: "28/09/2026",

        },

        {

          aluno: "Ana Oliveira",

          tentativa: 1,

          pontuacao: 9.5,

          data: "27/09/2026",

        },

      ],

    },

  ]);



  const [novaAvaliacao, setNovaAvaliacao] = useState({

    titulo: "",

    descricao: "",

    categoria: "Tecnologia",

    dificuldade: "Médio",

  });



  const [questoes, setQuestoes] = useState([

    {

      id: 1,

      enunciado: "",

      alternativas: {

        A: "",

        B: "",

        C: "",

        D: "",

      },

      correta: "A",

      pontuacao: 1,

    },

  ]);



  const totalTentativas = avaliacoes.reduce(

    (total, avaliacao) => total + avaliacao.tentativas.length,

    0

  );



  const todasPontuacoes = avaliacoes.flatMap((avaliacao) =>

    avaliacao.tentativas.map((tentativa) => tentativa.pontuacao)

  );



  const mediaGeral =

    todasPontuacoes.length > 0

      ? todasPontuacoes.reduce((total, nota) => total + nota, 0) /

        todasPontuacoes.length

      : 0;



  const mudarPagina = (novaPagina) => {

    setPagina(novaPagina);

    setAvaliacaoSelecionada(null);

    setModoCriacao(false);

  };



  const abrirCriacao = () => {

    setModoCriacao(true);

    setAvaliacaoSelecionada(null);

    setPagina("avaliacoes");

  };



  const voltarParaAvaliacoes = () => {

    setModoCriacao(false);

    setAvaliacaoSelecionada(null);

  };



  const abrirConfirmacaoExclusao = (avaliacao) => {
    setAvaliacaoParaExcluir(avaliacao);
  };

  const cancelarExclusao = () => {
    setAvaliacaoParaExcluir(null);
  };

  const excluirAvaliacao = () => {
    if (!avaliacaoParaExcluir) {
      return;
    }

    setAvaliacoes((avaliacoesAtuais) =>
      avaliacoesAtuais.filter(
        (avaliacao) => avaliacao.id !== avaliacaoParaExcluir.id
      )
    );

    if (avaliacaoSelecionada?.id === avaliacaoParaExcluir.id) {
      setAvaliacaoSelecionada(null);
    }

    setAvaliacaoParaExcluir(null);
  };

  const atualizarQuestao = (id, campo, valor) => {

    setQuestoes((questoesAtuais) =>

      questoesAtuais.map((questao) =>

        questao.id === id

          ? {

              ...questao,

              [campo]: valor,

            }

          : questao

      )

    );

  };



  const atualizarAlternativa = (id, alternativa, valor) => {

    setQuestoes((questoesAtuais) =>

      questoesAtuais.map((questao) =>

        questao.id === id

          ? {

              ...questao,

              alternativas: {

                ...questao.alternativas,

                [alternativa]: valor,

              },

            }

          : questao

      )

    );

  };



  const adicionarQuestao = () => {

    setQuestoes((questoesAtuais) => [

      ...questoesAtuais,

      {

        id: Date.now(),

        enunciado: "",

        alternativas: {

          A: "",

          B: "",

          C: "",

          D: "",

        },

        correta: "A",

        pontuacao: 1,

      },

    ]);

  };



  const removerQuestao = (id) => {

    if (questoes.length === 1) {

      return;

    }



    setQuestoes((questoesAtuais) =>

      questoesAtuais.filter((questao) => questao.id !== id)

    );

  };



  const salvarAvaliacao = () => {

    if (!novaAvaliacao.titulo.trim()) {

      alert("Digite um título para a avaliação.");

      return;

    }



    if (!novaAvaliacao.descricao.trim()) {

      alert("Digite uma descrição para a avaliação.");

      return;

    }



    const algumaQuestaoVazia = questoes.some(

      (questao) =>

        !questao.enunciado.trim() ||

        !questao.alternativas.A.trim() ||

        !questao.alternativas.B.trim() ||

        !questao.alternativas.C.trim() ||

        !questao.alternativas.D.trim()

    );



    if (algumaQuestaoVazia) {

      alert("Preencha todas as questões e alternativas.");

      return;

    }



    const nova = {

      id: Date.now(),

      titulo: novaAvaliacao.titulo,

      descricao: novaAvaliacao.descricao,

      questoes: questoes.length,

      categoria: novaAvaliacao.categoria,

      dificuldade: novaAvaliacao.dificuldade,

      tentativas: [],

    };



    setAvaliacoes((avaliacoesAtuais) => [

      ...avaliacoesAtuais,

      nova,

    ]);



    setNovaAvaliacao({

      titulo: "",

      descricao: "",

      categoria: "Tecnologia",

      dificuldade: "Médio",

    });



    setQuestoes([

      {

        id: Date.now(),

        enunciado: "",

        alternativas: {

          A: "",

          B: "",

          C: "",

          D: "",

        },

        correta: "A",

        pontuacao: 1,

      },

    ]);



    setModoCriacao(false);

    setPagina("avaliacoes");



    alert("Avaliação criada com sucesso!");

  };



  return (

    <div className="min-h-screen bg-[#a69cf3] text-[#29263d]">



      {/* navbar */}

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/95 shadow-[0_4px_20px_rgba(49,42,105,0.08)] backdrop-blur-xl">



        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">



          <button

            onClick={() => mudarPagina("inicio")}

            className="flex items-center gap-2.5"

          >

            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7665e8] text-sm font-bold text-white shadow-[0_5px_14px_rgba(118,101,232,0.35)]">

              E

            </span>



            <span className="text-lg font-bold tracking-tight">

              EduQuest

            </span>

          </button>



          <nav className="hidden items-center gap-1 md:flex">



            {[

              ["inicio", "Início", "home"],

              ["avaliacoes", "Avaliações", "clipboard"],

              ["leaderboard", "Leaderboard", "trophy"],

              ["faq", "FAQ", "help"],

            ].map(([id, label, icon]) => (

              <button

                key={id}

                onClick={() => mudarPagina(id)}

                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${

                  pagina === id

                    ? "bg-[#eeeaff] text-[#6b59df] shadow-sm"

                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"

                }`}

              >

                <Icon name={icon} size={16} />

                {label}

              </button>

            ))}



          </nav>



          <div className="flex items-center gap-3">



            <span className="hidden rounded-full bg-[#eeeaff] px-3 py-1.5 text-xs font-semibold text-[#6b59df] sm:block">

              Professor

            </span>



            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8574f0] to-[#6755d7] text-xs font-bold text-white shadow-[0_5px_14px_rgba(118,101,232,0.3)]">

              PR

            </div>



          </div>

        </div>

      </header>



      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">



        {/* início */}

        {pagina === "inicio" && (

          <section className="space-y-5">



            <div className="overflow-hidden rounded-[24px] bg-white p-7 shadow-[0_12px_35px_rgba(57,49,122,0.12)]">



              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">



                <div>



                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eeeaff] px-3 py-1.5 text-xs font-semibold text-[#6b59df]">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#7665e8]" />

                    painel do professor

                  </div>



                  <h1 className="text-3xl font-bold tracking-tight">

                    Bem-vindo ao EduQuest!

                  </h1>



                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">

                    Acompanhe suas avaliações e visualize o desempenho dos

                    alunos em um só lugar.

                  </p>



                </div>



                <button

                  onClick={() => mudarPagina("avaliacoes")}

                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-5 py-3 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(118,101,232,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#6958dc]"

                >

                  <Icon name="clipboard" size={17} />

                  Ver avaliações

                  <Icon name="arrow" size={16} />

                </button>



              </div>

            </div>



            <div className="grid gap-4 sm:grid-cols-3">



              {[

                {

                  titulo: "Avaliações",

                  valor: avaliacoes.length,

                  icon: "clipboard",

                },

                {

                  titulo: "Tentativas realizadas",

                  valor: totalTentativas,

                  icon: "users",

                },

                {

                  titulo: "Média geral",

                  valor: mediaGeral.toFixed(1),

                  icon: "chart",

                },

              ].map((item) => (

                <div

                  key={item.titulo}

                  className="rounded-[22px] bg-white p-5 shadow-[0_9px_25px_rgba(57,49,122,0.1)] transition-all hover:-translate-y-1"

                >



                  <div className="flex items-start justify-between">



                    <div>

                      <p className="text-sm font-medium text-gray-500">

                        {item.titulo}

                      </p>



                      <p className="mt-2 text-3xl font-bold tracking-tight">

                        {item.valor}

                      </p>

                    </div>



                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeeaff] text-[#7665e8]">

                      <Icon name={item.icon} size={20} />

                    </span>



                  </div>



                </div>

              ))}



            </div>



          </section>

        )}



        {/* criação da avaliação */}

        {pagina === "avaliacoes" && modoCriacao && (

          <section>



            <button

              onClick={voltarParaAvaliacoes}

              className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-[0_6px_18px_rgba(57,49,122,0.08)] transition hover:-translate-x-0.5 hover:text-[#7665e8]"

            >

              <Icon name="back" size={16} />

              Voltar para avaliações

            </button>



            <div className="mb-5 rounded-[24px] bg-white p-7 shadow-[0_12px_32px_rgba(57,49,122,0.1)]">



              <div className="flex items-center gap-4">



                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7665e8]">

                  <Icon name="plus" size={24} />

                </div>



                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-[#7665e8]">

                    professor

                  </p>



                  <h1 className="text-2xl font-bold">

                    Criar avaliação

                  </h1>



                  <p className="mt-1 text-sm text-gray-500">

                    Crie uma nova avaliação para seus alunos.

                  </p>

                </div>



              </div>



            </div>



            <div className="space-y-5">



              {/* informações gerais */}

              <div className="rounded-[22px] bg-white p-6 shadow-[0_10px_28px_rgba(57,49,122,0.1)]">



                <div className="mb-5">



                  <h2 className="text-lg font-bold">

                    Informações da avaliação

                  </h2>



                  <p className="mt-1 text-sm text-gray-500">

                    Preencha as informações básicas antes de adicionar as

                    questões.

                  </p>



                </div>



                <div className="grid gap-5">



                  <div>

                    <label className="mb-2 block text-sm font-semibold">

                      Título da avaliação

                    </label>



                    <input

                      type="text"

                      value={novaAvaliacao.titulo}

                      onChange={(e) =>

                        setNovaAvaliacao({

                          ...novaAvaliacao,

                          titulo: e.target.value,

                        })

                      }

                      placeholder="Ex.: Fundamentos de HTML e CSS"

                      className="w-full rounded-xl border border-gray-200 bg-[#faf9ff] px-4 py-3 text-sm outline-none transition focus:border-[#7665e8] focus:bg-white focus:ring-4 focus:ring-[#7665e8]/10"

                    />

                  </div>



                  <div>

                    <label className="mb-2 block text-sm font-semibold">

                      Descrição

                    </label>



                    <textarea

                      rows="3"

                      value={novaAvaliacao.descricao}

                      onChange={(e) =>

                        setNovaAvaliacao({

                          ...novaAvaliacao,

                          descricao: e.target.value,

                        })

                      }

                      placeholder="Descreva brevemente o conteúdo da avaliação."

                      className="w-full resize-none rounded-xl border border-gray-200 bg-[#faf9ff] px-4 py-3 text-sm outline-none transition focus:border-[#7665e8] focus:bg-white focus:ring-4 focus:ring-[#7665e8]/10"

                    />

                  </div>



                  <div className="grid gap-5 sm:grid-cols-2">



                    <div>

                      <label className="mb-2 block text-sm font-semibold">

                        Categoria

                      </label>



                      <select

                        value={novaAvaliacao.categoria}

                        onChange={(e) =>

                          setNovaAvaliacao({

                            ...novaAvaliacao,

                            categoria: e.target.value,

                          })

                        }

                        className="w-full rounded-xl border border-gray-200 bg-[#faf9ff] px-4 py-3 text-sm outline-none transition focus:border-[#7665e8] focus:ring-4 focus:ring-[#7665e8]/10"

                      >

                        <option>Tecnologia</option>

                        <option>Programação</option>

                        <option>Banco de Dados</option>

                        <option>Desenvolvimento Web</option>

                        <option>Outros</option>

                      </select>

                    </div>



                    <div>

                      <label className="mb-2 block text-sm font-semibold">

                        Dificuldade

                      </label>



                      <select

                        value={novaAvaliacao.dificuldade}

                        onChange={(e) =>

                          setNovaAvaliacao({

                            ...novaAvaliacao,

                            dificuldade: e.target.value,

                          })

                        }

                        className="w-full rounded-xl border border-gray-200 bg-[#faf9ff] px-4 py-3 text-sm outline-none transition focus:border-[#7665e8] focus:ring-4 focus:ring-[#7665e8]/10"

                      >

                        <option>Fácil</option>

                        <option>Médio</option>

                        <option>Difícil</option>

                      </select>

                    </div>



                  </div>



                </div>



              </div>



              {/* questões */}

              <div className="rounded-[22px] bg-white p-6 shadow-[0_10px_28px_rgba(57,49,122,0.1)]">



                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">



                  <div>



                    <h2 className="text-lg font-bold">

                      Questões

                    </h2>



                    <p className="mt-1 text-sm text-gray-500">

                      Adicione as perguntas e suas alternativas.

                    </p>



                  </div>



                  <span className="w-fit rounded-full bg-[#eeeaff] px-3 py-1.5 text-xs font-bold text-[#6b59df]">

                    {questoes.length}{" "}

                    {questoes.length === 1 ? "questão" : "questões"}

                  </span>



                </div>



                <div className="space-y-5">



                  {questoes.map((questao, index) => (

                    <div

                      key={questao.id}

                      className="rounded-2xl border border-gray-200 bg-[#faf9ff] p-5"

                    >



                      <div className="mb-5 flex items-center justify-between gap-3">



                        <div className="flex items-center gap-3">



                          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7665e8] text-sm font-bold text-white">

                            {index + 1}

                          </span>



                          <div>

                            <p className="font-bold">

                              Questão {index + 1}

                            </p>



                            <p className="text-xs text-gray-500">

                              Escolha a alternativa correta.

                            </p>

                          </div>



                        </div>



                        {questoes.length > 1 && (

                          <button

                            onClick={() => removerQuestao(questao.id)}

                            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-red-50 hover:text-red-500"

                            title="Remover questão"

                          >

                            <Icon name="trash" size={17} />

                          </button>

                        )}



                      </div>



                      <div className="mb-5">



                        <label className="mb-2 block text-sm font-semibold">

                          Enunciado

                        </label>



                        <textarea

                          rows="3"

                          value={questao.enunciado}

                          onChange={(e) =>

                            atualizarQuestao(

                              questao.id,

                              "enunciado",

                              e.target.value

                            )

                          }

                          placeholder="Digite o enunciado da questão..."

                          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#7665e8] focus:ring-4 focus:ring-[#7665e8]/10"

                        />



                      </div>



                      <div className="grid gap-4 sm:grid-cols-2">



                        {["A", "B", "C", "D"].map((letra) => (

                          <div key={letra}>



                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">



                              <button

                                type="button"

                                onClick={() =>

                                  atualizarQuestao(

                                    questao.id,

                                    "correta",

                                    letra

                                  )

                                }

                                className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-bold transition ${

                                  questao.correta === letra

                                    ? "border-[#7665e8] bg-[#7665e8] text-white"

                                    : "border-gray-300 bg-white text-gray-500 hover:border-[#7665e8] hover:text-[#7665e8]"

                                }`}

                              >

                                {letra}

                              </button>



                              <span>Alternativa {letra}</span>



                              {questao.correta === letra && (

                                <span className="text-xs font-medium text-[#7665e8]">

                                  correta

                                </span>

                              )}



                            </label>



                            <input

                              type="text"

                              value={questao.alternativas[letra]}

                              onChange={(e) =>

                                atualizarAlternativa(

                                  questao.id,

                                  letra,

                                  e.target.value

                                )

                              }

                              placeholder={`Digite a alternativa ${letra}...`}

                              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-[#7665e8]/10 ${

                                questao.correta === letra

                                  ? "border-[#7665e8]/50 bg-[#f8f6ff]"

                                  : "border-gray-200 bg-white"

                              }`}

                            />



                          </div>

                        ))}



                      </div>



                      <div className="mt-5 flex items-center gap-3">



                        <label className="text-sm font-semibold">

                          Pontuação:

                        </label>



                        <input

                          type="number"

                          min="1"

                          value={questao.pontuacao}

                          onChange={(e) =>

                            atualizarQuestao(

                              questao.id,

                              "pontuacao",

                              Number(e.target.value)

                            )

                          }

                          className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#7665e8]"

                        />



                        <span className="text-xs text-gray-500">

                          ponto(s)

                        </span>



                      </div>



                    </div>

                  ))}



                </div>



                <button

                  onClick={adicionarQuestao}

                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c9c2fa] bg-[#faf9ff] px-4 py-3 text-sm font-semibold text-[#6b59df] transition hover:border-[#7665e8] hover:bg-[#eeeaff]"

                >

                  <Icon name="plus" size={17} />

                  Adicionar questão

                </button>



              </div>



              {/* ações */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">



                <button

                  onClick={voltarParaAvaliacoes}

                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-600 shadow-[0_6px_18px_rgba(57,49,122,0.08)] transition hover:bg-gray-50"

                >

                  Cancelar

                </button>



                <button

                  onClick={salvarAvaliacao}

                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-6 py-3 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(118,101,232,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#6958dc]"

                >

                  <Icon name="save" size={17} />

                  Salvar avaliação

                </button>



              </div>



            </div>



          </section>

        )}



        {/* lista de avaliações */}

        {pagina === "avaliacoes" &&

          !modoCriacao &&

          !avaliacaoSelecionada && (

            <section>



              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">



                <div>



                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#6b59df]">

                    <Icon name="clipboard" size={15} />

                    professor

                  </div>



                  <h1 className="text-3xl font-bold tracking-tight">

                    Minhas avaliações

                  </h1>



                  <p className="mt-2 text-sm text-gray-500">

                    Visualize suas avaliações e acompanhe as tentativas dos

                    alunos.

                  </p>



                </div>



                <button

                  onClick={abrirCriacao}

                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-5 py-3 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(118,101,232,0.3)] transition-all hover:-translate-y-0.5 hover:bg-[#6958dc]"

                >

                  <Icon name="plus" size={17} />

                  Criar avaliação

                </button>



              </div>



              <div className="grid gap-5 md:grid-cols-2">



                {avaliacoes.map((avaliacao, index) => (

                  <article

                    key={avaliacao.id}

                    className="group overflow-hidden rounded-[22px] bg-white shadow-[0_10px_28px_rgba(57,49,122,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(57,49,122,0.16)]"

                  >



                    <div className="relative overflow-hidden bg-gradient-to-br from-[#7665e8] to-[#8c7bf2] px-6 py-6 text-white">



                      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />



                      <div className="relative flex items-start justify-between gap-4">



                        <div>



                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">

                            <Icon name="clipboard" size={20} />

                          </div>



                          <p className="text-xs font-medium text-white/70">

                            avaliação

                          </p>



                          <h2 className="mt-1 text-xl font-bold leading-tight">

                            {avaliacao.titulo}

                          </h2>



                        </div>



                        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">

                          {avaliacao.questoes} questões

                        </span>



                      </div>

                    </div>



                    <div className="p-6">



                      <p className="min-h-[48px] text-sm leading-6 text-gray-500">

                        {avaliacao.descricao}

                      </p>



                      <div className="mt-5 grid grid-cols-2 gap-3">



                        <div className="rounded-xl bg-[#f7f6ff] px-4 py-3">

                          <div className="flex items-center gap-2 text-xs text-gray-500">

                            <Icon name="users" size={15} />

                            tentativas

                          </div>



                          <p className="mt-1 font-bold">

                            {avaliacao.tentativas.length}

                          </p>

                        </div>



                        <div className="rounded-xl bg-[#f7f6ff] px-4 py-3">

                          <div className="flex items-center gap-2 text-xs text-gray-500">

                            <Icon name="star" size={15} />

                            dificuldade

                          </div>



                          <p className="mt-1 font-bold">

                            {avaliacao.dificuldade}

                          </p>

                        </div>



                      </div>



                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() => setAvaliacaoSelecionada(avaliacao)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-4 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(118,101,232,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#6958dc]"
                        >
                          Ver resultados
                          <Icon name="arrow" size={16} />
                        </button>

                        <button
                          onClick={() => abrirConfirmacaoExclusao(avaliacao)}
                          aria-label={`Excluir ${avaliacao.titulo}`}
                          title="Excluir avaliação"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-100 hover:text-red-600"
                        >
                          <Icon name="trash" size={18} />
                        </button>
                      </div>



                    </div>

                  </article>

                ))}



              </div>



            </section>

          )}



        {/* resultados */}

        {pagina === "avaliacoes" &&

          !modoCriacao &&

          avaliacaoSelecionada && (

            <section>



              <button

                onClick={() => setAvaliacaoSelecionada(null)}

                className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-[0_6px_18px_rgba(57,49,122,0.08)] transition hover:-translate-x-0.5 hover:text-[#7665e8]"

              >

                <Icon name="back" size={16} />

                Voltar para avaliações

              </button>



              <div className="rounded-[24px] bg-white p-6 shadow-[0_12px_32px_rgba(57,49,122,0.1)]">



                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">



                  <div>



                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#7665e8]">

                      <Icon name="chart" size={15} />

                      resultados da avaliação

                    </div>



                    <h1 className="text-2xl font-bold">

                      {avaliacaoSelecionada.titulo}

                    </h1>



                    <p className="mt-2 text-sm text-gray-500">

                      Confira as tentativas e pontuações dos alunos.

                    </p>



                  </div>



                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7665e8]">

                    <Icon name="chart" size={26} />

                  </div>



                </div>



              </div>



              <div className="mt-5 grid gap-4 sm:grid-cols-3">



                {[

                  [

                    "Questões",

                    avaliacaoSelecionada.questoes,

                    "clipboard",

                  ],

                  [

                    "Tentativas",

                    avaliacaoSelecionada.tentativas.length,

                    "users",

                  ],

                  [

                    "Média",

                    avaliacaoSelecionada.tentativas.length > 0

                      ? (

                          avaliacaoSelecionada.tentativas.reduce(

                            (total, tentativa) =>

                              total + tentativa.pontuacao,

                            0

                          ) / avaliacaoSelecionada.tentativas.length

                        ).toFixed(1)

                      : "-",

                    "chart",

                  ],

                ].map(([titulo, valor, icon]) => (

                  <div

                    key={titulo}

                    className="rounded-[20px] bg-white p-5 shadow-[0_8px_24px_rgba(57,49,122,0.09)]"

                  >



                    <div className="flex items-center justify-between">



                      <div>

                        <p className="text-sm text-gray-500">

                          {titulo}

                        </p>



                        <p className="mt-1 text-2xl font-bold">

                          {valor}

                        </p>

                      </div>



                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeeaff] text-[#7665e8]">

                        <Icon name={icon} size={18} />

                      </span>



                    </div>



                  </div>

                ))}



              </div>



              <div className="mt-5 overflow-hidden rounded-[22px] bg-white shadow-[0_10px_28px_rgba(57,49,122,0.1)]">



                <div className="border-b px-6 py-5">



                  <div className="flex items-center gap-3">



                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeeaff] text-[#7665e8]">

                      <Icon name="users" size={19} />

                    </div>



                    <div>

                      <h2 className="font-bold">

                        Tentativas dos alunos

                      </h2>



                      <p className="mt-0.5 text-xs text-gray-500">

                        Todos os resultados registrados nesta avaliação.

                      </p>

                    </div>



                  </div>



                </div>



                {avaliacaoSelecionada.tentativas.length === 0 ? (

                  <div className="px-6 py-12 text-center">



                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7665e8]">

                      <Icon name="users" size={21} />

                    </div>



                    <h3 className="mt-4 font-bold">

                      Nenhuma tentativa ainda

                    </h3>



                    <p className="mt-1 text-sm text-gray-500">

                      Os resultados dos alunos aparecerão aqui quando eles

                      realizarem a avaliação.

                    </p>



                  </div>

                ) : (

                  <div className="overflow-x-auto">



                    <table className="w-full text-sm">



                      <thead className="bg-[#f7f6ff]">

                        <tr>

                          <th className="px-6 py-4 text-left font-semibold text-gray-600">

                            Aluno

                          </th>



                          <th className="px-6 py-4 text-left font-semibold text-gray-600">

                            Tentativa

                          </th>



                          <th className="px-6 py-4 text-left font-semibold text-gray-600">

                            Data

                          </th>



                          <th className="px-6 py-4 text-left font-semibold text-gray-600">

                            Pontuação

                          </th>

                        </tr>

                      </thead>



                      <tbody>



                        {avaliacaoSelecionada.tentativas.map(

                          (tentativa, index) => (

                            <tr

                              key={index}

                              className="border-t border-gray-100 transition-colors hover:bg-[#faf9ff]"

                            >



                              <td className="px-6 py-4">



                                <div className="flex items-center gap-3">



                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8a79ef] to-[#6958d9] text-xs font-bold text-white">

                                    {tentativa.aluno

                                      .split(" ")

                                      .map((nome) => nome[0])

                                      .slice(0, 2)

                                      .join("")}

                                  </div>



                                  <span className="font-semibold">

                                    {tentativa.aluno}

                                  </span>



                                </div>



                              </td>



                              <td className="px-6 py-4 text-gray-500">

                                <span className="inline-flex items-center gap-1.5">

                                  <Icon name="clock" size={15} />

                                  {tentativa.tentativa}ª tentativa

                                </span>

                              </td>



                              <td className="px-6 py-4 text-gray-500">

                                {tentativa.data}

                              </td>



                              <td className="px-6 py-4">



                                <span

                                  className={`inline-flex min-w-[52px] justify-center rounded-full px-3 py-1.5 text-xs font-bold ${

                                    tentativa.pontuacao >= 8

                                      ? "bg-[#dcf6df] text-[#31933b]"

                                      : tentativa.pontuacao >= 6

                                        ? "bg-[#fff0d4] text-[#c27a00]"

                                        : "bg-[#ffe1e1] text-[#d93636]"

                                  }`}

                                >

                                  {tentativa.pontuacao.toFixed(1)}

                                </span>



                              </td>



                            </tr>

                          )

                        )}



                      </tbody>



                    </table>



                  </div>

                )}



              </div>



            </section>

          )}



        {/* leaderboard */}

        {pagina === "leaderboard" && (

          <section>



            <div className="mb-5 rounded-[24px] bg-white p-7 shadow-[0_12px_32px_rgba(57,49,122,0.1)]">



              <div className="flex items-center gap-3">



                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0d4] text-[#e49a17]">

                  <Icon name="trophy" size={23} />

                </div>



                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-[#7665e8]">

                    desempenho

                  </p>



                  <h1 className="text-2xl font-bold">

                    Leaderboard

                  </h1>

                </div>



              </div>



              <p className="mt-3 text-sm text-gray-500">

                Acompanhe o desempenho dos alunos nas avaliações.

              </p>



            </div>



            <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_28px_rgba(57,49,122,0.1)]">



              {[

                ["Maria Silva", "9,4"],

                ["Ana Oliveira", "9,1"],

                ["João Santos", "8,7"],

                ["Carlos Souza", "7,8"],

              ].map((aluno, index) => (

                <div

                  key={aluno[0]}

                  className="flex items-center justify-between border-b border-gray-100 px-6 py-5 transition hover:bg-[#faf9ff]"

                >



                  <div className="flex items-center gap-4">



                    <span

                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${

                        index === 0

                          ? "bg-[#fff0d4] text-[#d8900f]"

                          : index === 1

                            ? "bg-[#eeeaff] text-[#7665e8]"

                            : "bg-gray-100 text-gray-500"

                      }`}

                    >

                      {index + 1}

                    </span>



                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8a79ef] to-[#6958d9] text-xs font-bold text-white">

                      {aluno[0]

                        .split(" ")

                        .map((nome) => nome[0])

                        .join("")}

                    </div>



                    <span className="font-semibold">

                      {aluno[0]}

                    </span>



                  </div>



                  <span className="rounded-full bg-[#eeeaff] px-3 py-1.5 text-sm font-bold text-[#6b59df]">

                    {aluno[1]}

                  </span>



                </div>

              ))}



            </div>



          </section>

        )}



        {/* faq */}

        {pagina === "faq" && (

          <section>



            <div className="mb-5 rounded-[24px] bg-white p-7 shadow-[0_12px_32px_rgba(57,49,122,0.1)]">



              <div className="flex items-center gap-3">



                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#7665e8]">

                  <Icon name="help" size={23} />

                </div>



                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-[#7665e8]">

                    central de ajuda

                  </p>



                  <h1 className="text-2xl font-bold">

                    Perguntas frequentes

                  </h1>

                </div>



              </div>



              <p className="mt-3 text-sm text-gray-500">

                Encontre respostas para as principais dúvidas sobre o EduQuest.

              </p>



            </div>



            <div className="space-y-3">



              {[

                {

                  pergunta:

                    "Como visualizar os resultados de uma avaliação?",

                  resposta:

                    "Acesse Avaliações e selecione a avaliação desejada para visualizar as tentativas e pontuações dos alunos.",

                },

                {

                  pergunta:

                    "Onde vejo as tentativas dos alunos?",

                  resposta:

                    "Os resultados ficam disponíveis dentro da avaliação selecionada.",

                },

                {

                  pergunta:

                    "O que aparece nos resultados?",

                  resposta:

                    "São apresentados o aluno, número da tentativa, data e pontuação obtida.",

                },

              ].map((item, index) => {



                const aberto = faqAberto === index;



                return (

                  <button

                    key={item.pergunta}

                    onClick={() =>

                      setFaqAberto(aberto ? null : index)

                    }

                    className="w-full rounded-[20px] bg-white p-5 text-left shadow-[0_7px_22px_rgba(57,49,122,0.08)] transition-all hover:shadow-[0_10px_28px_rgba(57,49,122,0.12)]"

                  >



                    <div className="flex items-center justify-between gap-4">



                      <span className="font-semibold">

                        {item.pergunta}

                      </span>



                      <span

                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eeeaff] text-[#7665e8] transition-transform ${

                          aberto ? "rotate-180" : ""

                        }`}

                      >

                        <Icon name="chevron" size={16} />

                      </span>



                    </div>



                    {aberto && (

                      <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-6 text-gray-500">

                        {item.resposta}

                      </p>

                    )}



                  </button>

                );

              })}



            </div>



          </section>

        )}





      {avaliacaoParaExcluir && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#29263d]/45 p-4 backdrop-blur-sm"
          onClick={cancelarExclusao}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-confirmacao-exclusao"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_24px_70px_rgba(41,38,61,0.25)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Icon name="trash" size={22} />
            </div>

            <h2
              id="titulo-confirmacao-exclusao"
              className="mt-5 text-xl font-bold text-[#29263d]"
            >
              Excluir avaliação?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Você tem certeza que deseja excluir{" "}
              <span className="font-semibold text-[#29263d]">
                "{avaliacaoParaExcluir.titulo}"
              </span>
              ? Essa ação não poderá ser desfeita.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={cancelarExclusao}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={excluirAvaliacao}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(239,68,68,0.22)] transition hover:bg-red-600"
              >
                <Icon name="trash" size={17} />
                Excluir avaliação
              </button>
            </div>
          </div>
        </div>
      )}

      </main>

    </div>

  );

}



export default Professor;