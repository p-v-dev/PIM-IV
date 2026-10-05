function QuickAction({ titulo, descricao }) {
  return (
    <article className="group rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(57,49,122,0.1)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(57,49,122,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeeaff] text-lg font-bold text-[#7665e8]">
          →
        </span>

        <span className="text-xl font-semibold text-[#7665e8] transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#29263d]">
        {titulo}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#5f5b73]">
        {descricao}
      </p>
    </article>
  );
}

export default QuickAction;