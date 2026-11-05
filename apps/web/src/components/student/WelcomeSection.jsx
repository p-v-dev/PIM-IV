import { Link, useRouteLoaderData } from "react-router";

function WelcomeSection() {
  const user = useRouteLoaderData("student");
  return (
    <section className="rounded-[24px] bg-white p-7 shadow-[0_12px_35px_rgba(57,49,122,0.12)]">
      <span className="inline-flex rounded-full bg-[#eeeaff] px-3 py-1 text-sm font-semibold text-[#6b59df]">
        painel do estudante
      </span>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#29263d]">
            Olá, {user.name}!
          </h1>

          <p className="mt-2 max-w-2xl text-[#5f5b73]">
            Continue sua jornada de aprendizado e acompanhe sua evolução.
          </p>
          <p className="mt-3 font-semibold text-[#6b59df]">{user.points} pontos acumulados</p>
        </div>

        <Link to="/avaliacoes" className="rounded-xl bg-[#7665e8] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#6b59df]">
          Continuar estudando
        </Link>
      </div>
    </section>
  );
}

export default WelcomeSection;
