import { useEffect, useRef, useState } from "react";
import {
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiEye,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { Link, useLocation, useNavigate, useRouteLoaderData } from "react-router";
import { logout } from "../../services/authService.js";
import ExitConfirmation from "../student/ExitConfirmation";

const links = [
  { nome: "Início", icone: FiHome, destino: "/aluno" },
  { nome: "Avaliações", icone: FiBookOpen, destino: "/avaliacoes" },
  { nome: "Desempenho", icone: FiBarChart2, destino: "/desempenho" },
  { nome: "FAQ", icone: FiHelpCircle, destino: "/faq" },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useRouteLoaderData("student");
  const [menuAberto, setMenuAberto] = useState(false);
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [altoContraste, setAltoContraste] = useState(() =>
    document.documentElement.classList.contains("alto-contraste")
  );
  const menuRef = useRef(null);

  useEffect(() => {
    const fecharAoClicarFora = (evento) => {
      if (menuRef.current && !menuRef.current.contains(evento.target)) {
        setMenuAberto(false);
      }
    };

    const fecharComEscape = (evento) => {
      if (evento.key === "Escape") {
        setMenuAberto(false);
      }
    };

    document.addEventListener("mousedown", fecharAoClicarFora);
    document.addEventListener("keydown", fecharComEscape);

    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
      document.removeEventListener("keydown", fecharComEscape);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "alto-contraste",
      altoContraste
    );
  }, [altoContraste]);

  function alternarContraste() {
    setAltoContraste((atual) => !atual);
  }

  function sair() {
    setMenuAberto(false);
    setConfirmarSaida(true);
  }

  function cancelarSaida() {
    setConfirmarSaida(false);
  }

  function confirmarLogout() {
    setConfirmarSaida(false);

    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[68px] items-center justify-between gap-3 py-3">
          <Link
            to="/aluno"
            className="flex shrink-0 items-center gap-2 sm:gap-3"
            aria-label="EduQuest - Página inicial"
          >
            <strong className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7665e8] text-lg text-white">
              E
            </strong>
            <span className="text-lg font-bold text-[#29263d] sm:text-xl">
              EduQuest
            </span>
          </Link>

          <div
            ref={menuRef}
            className="relative flex shrink-0 items-center gap-2 sm:gap-3 md:order-3"
          >
            <span className="hidden rounded-xl bg-[#eeeaff] px-3 py-2 text-sm font-semibold text-[#6b59df] sm:inline-flex">
              Estudante
            </span>

            <button
              type="button"
              aria-label="Menu do estudante"
              aria-expanded={menuAberto}
              aria-haspopup="menu"
              onClick={() => setMenuAberto((aberto) => !aberto)}
              className="flex h-10 items-center justify-center gap-1 rounded-xl border border-[#e7e3ff] bg-white px-2 text-[#6b59df] transition hover:bg-[#f5f3ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7665e8]"
            >
              <FiUser size={20} aria-hidden="true" />
              <FiChevronDown
                size={16}
                aria-hidden="true"
                className={`transition-transform ${menuAberto ? "rotate-180" : ""}`}
              />
            </button>

            {menuAberto && (
              <div
                role="menu"
                aria-label="Opções do estudante"
                className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-[#e7e3ff] bg-white p-2 shadow-xl"
              >
                <div className="border-b border-[#eeeafc] px-3 py-3">
                  <p className="font-semibold text-[#29263d]">{user.name}</p>
                  <p className="mt-1 break-all text-sm text-[#625f73]">{user.email}</p>
                  <p className="mt-1 text-sm text-[#625f73]">
                    Preferências de acessibilidade
                  </p>
                </div>

                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={altoContraste}
                  onClick={alternarContraste}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#29263d] transition hover:bg-[#f5f3ff] focus-visible:outline-2 focus-visible:outline-[#7665e8]"
                >
                  <FiEye size={19} aria-hidden="true" />
                  <span className="flex-1">Alto contraste</span>
                  {altoContraste && (
                    <FiCheck
                      size={18}
                      className="text-[#6b59df]"
                      aria-label="Ativado"
                    />
                  )}
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={sair}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500"
                >
                  <FiLogOut size={19} aria-hidden="true" />
                  Sair
                </button>
              </div>
            )}
          </div>

          <ul className="hidden items-center gap-1 md:order-2 md:flex">
            {links.map(({ nome, icone: Icone, destino }) => {
              const ativo = location.pathname === destino;

              return (
                <li key={nome}>
                  <Link
                    to={destino}
                    aria-current={ativo ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${ativo
                      ? "bg-[#eeeaff] text-[#6b59df]"
                      : "text-[#625f73] hover:bg-[#f5f3ff] hover:text-[#6b59df]"
                      }`}
                  >
                    <Icone size={18} aria-hidden="true" />
                    {nome}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <ul className="grid grid-cols-4 gap-1 pb-2 md:hidden">
          {links.map(({ nome, icone: Icone, destino }) => {
            const ativo = location.pathname === destino;

            return (
              <li key={nome}>
                <Link
                  to={destino}
                  aria-current={ativo ? "page" : undefined}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-center text-xs font-semibold transition ${ativo
                    ? "bg-[#eeeaff] text-[#6b59df]"
                    : "text-[#625f73] hover:bg-[#f5f3ff] hover:text-[#6b59df]"
                    }`}
                >
                  <Icone size={19} aria-hidden="true" />
                  {nome}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>


      {confirmarSaida && (
        <ExitConfirmation
          onCancelar={cancelarSaida}
          onConfirmar={confirmarLogout}
        />
      )}

    </nav>
  );
}


export default Navbar;
