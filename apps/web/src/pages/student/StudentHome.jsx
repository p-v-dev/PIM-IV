import Navbar from "../../components/layout/Navbar";
import WelcomeSection from "../../components/student/WelcomeSection";
import LevelCard from "../../components/student/LevelCard";
import QuickAction from "../../components/student/QuickAction";

function StudentHome() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#a69cf3] px-4 py-8">
        <WelcomeSection />

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-[#29263d]">
            Seus níveis
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <LevelCard
              nivel="Nível 1"
              titulo="Fundamentos"
              progresso={70}
            />

            <LevelCard
              nivel="Nível 2"
              titulo="Programação"
              progresso={45}
            />

            <LevelCard
              nivel="Nível 3"
              titulo="Desenvolvimento"
              progresso={20}
            />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-[#29263d]">
            Ações rápidas
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <QuickAction
              titulo="Simulados"
              descricao="Teste seus conhecimentos."
            />

            <QuickAction
              titulo="Desempenho"
              descricao="Acompanhe sua evolução."
            />

            <QuickAction
              titulo="FAQ"
              descricao="Tire suas dúvidas e participe."
            />
          </div>
        </section>
      </main>
    </>
  );
}

export default StudentHome;