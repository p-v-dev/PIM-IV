import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";
import { ErrorState, LoadingState } from "../components/ScreenState";
import { buscarHistorico } from "../services/examService";
import { useAuth } from "../session/AuthContext";
import { colors } from "../theme";

function grade(result) {
  return result.totalQuestions > 0 ? result.score / result.totalQuestions * 10 : 0;
}

function formatGrade(value) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default function StudentPerformanceScreen() {
  const { signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    buscarHistorico()
      .then((data) => { if (active) setAttempts(data); })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401 || requestError.status === 403) signOut();
        else setError(requestError instanceof TypeError ? "Nao foi possivel conectar a API." : requestError.message);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry, signOut]);

  function retryRequest() {
    setError("");
    setLoading(true);
    setRetry((attempt) => attempt + 1);
  }

  const visibleAttempts = attempts.filter((attempt) => attempt.title.toLowerCase().includes(search.toLowerCase()));
  const grades = attempts.map(grade);
  const average = grades.length ? grades.reduce((total, value) => total + value, 0) / grades.length : 0;
  const highest = grades.length ? Math.max(...grades) : 0;
  const hasData = !loading && !error && attempts.length > 0;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}><Text style={styles.badge}>AREA DO ESTUDANTE</Text><Text style={styles.title}>Meu desempenho</Text><Text style={styles.description}>Acompanhe suas notas e sua evolucao nas avaliacoes realizadas.</Text></View>
        <View accessibilityLabel="Resumo do desempenho" style={styles.summary}>
          <Stat label="Media das notas" value={hasData ? `${formatGrade(average)} / 10` : "- / 10"} />
          <Stat label="Avaliacoes realizadas" value={loading || error ? "-" : String(attempts.length)} />
          <Stat label="Maior nota" value={hasData ? `${formatGrade(highest)} / 10` : "- / 10"} />
        </View>
        <Text style={styles.heading}>Historico de avaliacoes</Text>
        <Text style={styles.subtitle}>Consulte suas notas por avaliacao.</Text>
        <TextInput accessibilityLabel="Buscar no historico" onChangeText={setSearch} placeholder="Buscar pelo titulo da avaliacao" placeholderTextColor="#908BA3" style={styles.search} value={search} />
        {loading ? <LoadingState label="Carregando historico..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={retryRequest} /> : null}
        {!loading && !error && visibleAttempts.length === 0 ? <View style={styles.empty}><Text style={styles.emptyText}>{attempts.length ? "Nenhum resultado corresponde a sua busca." : "Voce ainda nao realizou avaliacoes."}</Text></View> : null}
        {!loading && !error && visibleAttempts.map((attempt) => {
          const value = grade(attempt);
          const percent = Math.min(100, Math.max(0, value * 10));
          return <View key={attempt.id} style={styles.attempt}><View style={styles.attemptTop}><View style={styles.attemptInfo}><Text style={styles.done}>CONCLUIDA</Text><Text style={styles.attemptTitle}>{attempt.title}</Text><Text style={styles.meta}>Realizada em {new Date(attempt.createdAt).toLocaleString("pt-BR")}</Text><Text style={styles.meta}>Acertos: {attempt.score} de {attempt.totalQuestions}</Text></View><View style={styles.grade}><Text style={styles.gradeLabel}>Nota</Text><Text style={styles.gradeValue}>{formatGrade(value)}<Text style={styles.gradeUnit}>/10</Text></Text></View></View><View style={styles.performance}><View style={styles.performanceLabels}><Text style={styles.meta}>Desempenho</Text><Text style={styles.meta}>{Math.round(percent)}%</Text></View><View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 10, now: value }} style={styles.progress}><View style={[styles.progressValue, { width: `${percent}%` }]} /></View></View></View>;
        })}
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value }) {
  return <View style={styles.stat}><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32 },
  header: { backgroundColor: colors.card, borderRadius: 22, padding: 22 },
  badge: { alignSelf: "flex-start", backgroundColor: "#EEEAFF", borderRadius: 16, color: colors.primary, fontSize: 12, fontWeight: "700", letterSpacing: 0.7, overflow: "hidden", paddingHorizontal: 12, paddingVertical: 7 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 16 },
  description: { color: colors.muted, lineHeight: 22, marginTop: 8 },
  summary: { gap: 12, marginTop: 20 },
  stat: { backgroundColor: colors.card, borderRadius: 18, padding: 18 },
  statLabel: { color: colors.muted, fontSize: 14 },
  statValue: { color: colors.text, fontSize: 24, fontWeight: "700", marginTop: 6 },
  heading: { color: colors.text, fontSize: 22, fontWeight: "700", marginTop: 28 },
  subtitle: { color: colors.muted, marginTop: 4 },
  search: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, fontSize: 16, marginVertical: 18, padding: 14 },
  empty: { backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  emptyText: { color: colors.muted },
  attempt: { backgroundColor: colors.card, borderRadius: 18, marginBottom: 12, padding: 18 },
  attemptTop: { flexDirection: "row", justifyContent: "space-between" },
  attemptInfo: { flex: 1, paddingRight: 12 },
  done: { color: colors.primary, fontSize: 11, fontWeight: "700", letterSpacing: 0.7 },
  attemptTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: 8 },
  meta: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 5 },
  grade: { alignItems: "center", backgroundColor: "#F4F2FF", borderRadius: 12, justifyContent: "center", minWidth: 76, padding: 10 },
  gradeLabel: { color: colors.muted, fontSize: 11 },
  gradeValue: { color: colors.primary, fontSize: 20, fontWeight: "700", marginTop: 3 },
  gradeUnit: { fontSize: 12 },
  performance: { marginTop: 18 },
  performanceLabels: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progress: { backgroundColor: "#EEEAFF", borderRadius: 4, height: 8, overflow: "hidden" },
  progressValue: { backgroundColor: colors.primary, height: "100%" },
});
