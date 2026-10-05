function LevelCard({ nivel, titulo, progresso }) {
  return (
    <article className="rounded-[22px] bg-white p-5 shadow-[0_10px_28px_rgba(57,49,122,0.1)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(57,49,122,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex rounded-full bg-[#eeeaff] px-3 py-1 text-sm font-semibold text-[#6b59df]">
            {nivel}
          </span>

          <h3 className="mt-3 text-xl font-bold text-[#29263d]">
            {titulo}
          </h3>
        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eeeaff] text-lg font-bold text-[#7665e8]">
          →
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-[#5f5b73]">
            Seu progresso
          </span>

          <span className="font-bold text-[#6b59df]">
            {progresso}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#eeeaff]">
          <div
            className="h-full rounded-full bg-[#7665e8]"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>
    </article>
  );
}

export default LevelCard;