
import { FiArrowUpRight, FiBookOpen, FiClock } from "react-icons/fi";
import { Link } from "react-router";

function EvaluationCard({ avaliacao }) {
  return (
    <article className="flex flex-col rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(57,49,122,0.1)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(57,49,122,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eeeaff] text-xl text-[#6b59df]">
          <FiBookOpen aria-hidden="true" />
        </span>

        <span className="rounded-full bg-[#eeeaff] px-3 py-1 text-xs font-semibold text-[#6b59df]">
          Avaliação
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#29263d]">
        {avaliacao.title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-[#5f5b73]">
        {avaliacao.description}
      </p>

      <p className="mt-5 flex items-center gap-2 text-sm text-[#5f5b73]">
        <FiClock aria-hidden="true" />
        Prazo: {new Date(avaliacao.deadline).toLocaleString("pt-BR")}
      </p>

      <Link
        to={`/avaliacao/${encodeURIComponent(avaliacao.id)}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-4 py-3 font-semibold text-white transition hover:bg-[#6b59df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b59df]"
      >
        Realizar avaliação
        <FiArrowUpRight aria-hidden="true" />
      </Link>
    </article>
  );
}

export default EvaluationCard;
