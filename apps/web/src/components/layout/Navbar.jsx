function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-[68px] max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <strong className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7665e8] text-lg text-white">
            E
          </strong>

          <span className="text-xl font-bold text-[#29263d]">
            EduQuest
          </span>
        </a>

        {/* Navegação */}
        <ul className="flex flex-wrap items-center justify-center gap-1">
          <li>
            <button className="rounded-xl bg-[#eeeaff] px-3 py-2 text-sm font-semibold text-[#6b59df]">
              Início
            </button>
          </li>

          <li>
            <button className="rounded-xl px-3 py-2 text-sm font-semibold text-[#29263d] hover:bg-[#eeeaff]">
              Simulados
            </button>
          </li>

          <li>
            <button className="rounded-xl px-3 py-2 text-sm font-semibold text-[#29263d] hover:bg-[#eeeaff]">
              Desempenho
            </button>
          </li>

          <li>
            <button className="rounded-xl px-3 py-2 text-sm font-semibold text-[#29263d] hover:bg-[#eeeaff]">
              FAQ
            </button>
          </li>
        </ul>

        {/* Usuário */}
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-[#eeeaff] px-3 py-2 text-sm font-semibold text-[#6b59df]">
            Estudante
          </span>

          <strong className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8574f0] to-[#6755d7] text-white">
            E
          </strong>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;