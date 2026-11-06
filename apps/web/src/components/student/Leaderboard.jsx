
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FiAward, FiTrendingUp } from "react-icons/fi";
import { buscarLeaderboard } from "../../services/examService.js";
import { logout } from "../../services/authService.js";

function Leaderboard() {
  const navigate = useNavigate();
  const [estudantes, setEstudantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let active = true;
    buscarLeaderboard()
      .then((ranking) => { if (active) setEstudantes(ranking); })
      .catch((error) => {
        if (!active) return;
        if (error.status === 401 || error.status === 403) {
          logout();
          navigate("/login", { replace: true });
        } else {
          setErro(error instanceof TypeError ? "Não foi possível conectar à API." : error.message);
        }
      })
      .finally(() => { if (active) setCarregando(false); });
    return () => { active = false; };
  }, [navigate, tentativa]);

  return (
    <section className="mt-8 rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(57,49,122,0.1)] sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeeaff] text-xl text-[#6b59df]">
          <FiAward aria-hidden="true" />
        </span>

        <div>
          <h2 className="text-xl font-bold text-[#29263d]">
            Ranking de estudantes
          </h2>
          <p className="text-sm text-[#5f5b73]">
            Acompanhe a pontuação da comunidade.
          </p>
        </div>
      </div>

      {carregando && <p role="status" className="mt-5 text-sm text-[#5f5b73]">Carregando ranking...</p>}
      {erro && <div role="alert" className="mt-5 text-sm text-red-700"><p>{erro}</p><button type="button" onClick={() => { setCarregando(true); setErro(""); setTentativa((atual) => atual + 1); }} className="mt-2 font-semibold text-[#6b59df]">Tentar novamente</button></div>}
      {!carregando && !erro && estudantes.length === 0 && <p className="mt-5 text-sm text-[#5f5b73]">Ainda não há alunos no ranking.</p>}
      {!carregando && !erro && estudantes.length > 0 && <ol className="mt-5 divide-y divide-[#eeeaff]">
        {estudantes.map((estudante, index) => (
          <li
            key={estudante.studentId}
            className="flex items-center justify-between gap-3 py-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eeeaff] font-bold text-[#6b59df]">
                {index + 1}
              </span>

              <span className="truncate font-semibold text-[#29263d]">
                {estudante.name}
              </span>
            </div>

            <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-[#6b59df]">
              <FiTrendingUp aria-hidden="true" />
              {estudante.points} pts
            </span>
          </li>
        ))}
      </ol>}
    </section>
  );
}

export default Leaderboard;
