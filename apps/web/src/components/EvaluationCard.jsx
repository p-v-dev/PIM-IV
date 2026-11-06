
function EvaluationCard({
  avaliacao,
  Icon,
  onViewResults,
  onDeactivate,
}) {
  return (
    <article
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
              {avaliacao.title}
            </h2>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            {avaliacao.isActive === false && <span className="rounded-full bg-red-500/80 px-3 py-1.5 text-xs font-semibold">Inativa</span>}
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">{avaliacao.questionIds.length} questões</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="min-h-[48px] text-sm leading-6 text-gray-500">
          {avaliacao.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#f7f6ff] px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Icon name="clock" size={15} />
              prazo
            </div>

            <p className="mt-1 font-bold">
              {new Date(avaliacao.deadline).toLocaleString("pt-BR")}
            </p>
          </div>

          <div className="rounded-xl bg-[#f7f6ff] px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Icon name="clock" size={15} />
              criação
            </div>

            <p className="mt-1 font-bold">
              {new Date(avaliacao.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onViewResults(avaliacao)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7665e8] px-4 py-3 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(118,101,232,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#6958dc]"
          >
            Ver resultados
            <Icon name="arrow" size={16} />
          </button>

          <button
            type="button"
            disabled={avaliacao.isActive === false}
            onClick={() => onDeactivate(avaliacao)}
            aria-label={`Desativar ${avaliacao.title}`}
            title={avaliacao.isActive === false ? "Avaliação inativa" : "Desativar avaliação"}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="trash" size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default EvaluationCard;
