import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Leaderboard from "../components/Leaderboard";
import Screen from "../components/Screen";
import { ErrorState, LoadingState } from "../components/ScreenState";
import { isDemoMode } from "../config/api";
import { buscarAvaliacoes } from "../services/examService";
import { useAuth } from "../session/AuthContext";
import { colors } from "../theme";

export default function StudentHomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    buscarAvaliacoes()
      .then((data) => {
        if (active) setExams(data);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401 || requestError.status === 403) {
          signOut();
          return;
        }
        setError(requestError instanceof TypeError ? "Nao foi possivel conectar a API." : requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [retry, signOut]);

  function retryRequest() {
    setError("");
    setLoading(true);
    setRetry((attempt) => attempt + 1);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcome}>
          <Text style={styles.badge}>PAINEL DO ESTUDANTE</Text>
          {isDemoMode ? <Text style={styles.demo}>MODO LOCAL</Text> : null}
          <Text style={styles.heading}>Ola, {user?.name || "aluno"}!</Text>
          <Text style={styles.description}>Continue sua jornada de aprendizado e acompanhe sua evolucao.</Text>
          <Text style={styles.points}>{user?.points || 0} pontos acumulados</Text>
          <Pressable accessibilityRole="button" onPress={() => navigation.navigate("Evaluations")} style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>Continuar estudando</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suas avaliacoes</Text>
          <Text style={styles.sectionDescription}>Confira as avaliacoes disponiveis para voce.</Text>
        </View>

        {loading ? <LoadingState label="Carregando avaliacoes..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={retryRequest} /> : null}
        {!loading && !error && exams.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyText}>Nenhuma avaliacao disponivel no momento.</Text></View> : null}
        {!loading && !error && exams.map((exam) => (
          <Pressable accessibilityRole="button" key={exam.id} onPress={() => navigation.navigate("Evaluations")} style={styles.examCard}>
            <Text style={styles.examTitle}>{exam.title}</Text>
            <Text numberOfLines={2} style={styles.examDescription}>{exam.description}</Text>
            <Text style={styles.deadline}>Prazo: {new Date(exam.deadline).toLocaleString("pt-BR")}</Text>
          </Pressable>
        ))}

        <View style={styles.ranking}><Leaderboard /></View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32 },
  welcome: { backgroundColor: colors.card, borderRadius: 22, padding: 22 },
  badge: { alignSelf: "flex-start", backgroundColor: "#EEEAFF", borderRadius: 16, color: colors.primary, fontSize: 12, fontWeight: "700", letterSpacing: 0.7, overflow: "hidden", paddingHorizontal: 12, paddingVertical: 7 },
  demo: { color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 12 },
  heading: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 18 },
  description: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  points: { color: colors.primary, fontWeight: "700", marginTop: 14 },
  primaryAction: { alignSelf: "flex-start", backgroundColor: colors.primary, borderRadius: 12, marginTop: 20, paddingHorizontal: 16, paddingVertical: 13 },
  primaryActionText: { color: colors.card, fontWeight: "700" },
  sectionHeader: { marginBottom: 14, marginTop: 28 },
  sectionTitle: { color: colors.text, fontSize: 22, fontWeight: "700" },
  sectionDescription: { color: colors.muted, fontSize: 14, marginTop: 4 },
  emptyCard: { backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  emptyText: { color: colors.muted },
  examCard: { backgroundColor: colors.card, borderRadius: 18, marginBottom: 12, padding: 18 },
  examTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  examDescription: { color: colors.muted, lineHeight: 20, marginTop: 6 },
  deadline: { color: colors.muted, fontSize: 13, marginTop: 16 },
  ranking: { marginTop: 28 },
});
