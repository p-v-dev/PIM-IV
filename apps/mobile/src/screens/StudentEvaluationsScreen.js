import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";
import { ErrorState, LoadingState } from "../components/ScreenState";
import { buscarAvaliacoes } from "../services/examService";
import { useAuth } from "../session/AuthContext";
import { colors } from "../theme";

export default function StudentEvaluationsScreen({ navigation }) {
  const { signOut } = useAuth();
  const [search, setSearch] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    buscarAvaliacoes()
      .then((data) => { if (active) setExams(data); })
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

  const visibleExams = exams.filter((exam) => `${exam.title} ${exam.description}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.badge}>AREA DO ESTUDANTE</Text>
          <Text style={styles.title}>Suas avaliacoes</Text>
          <Text style={styles.description}>Consulte os questionarios disponiveis e escolha uma avaliacao para realizar.</Text>
        </View>
        <TextInput accessibilityLabel="Buscar avaliacao" onChangeText={setSearch} placeholder="Buscar por titulo ou descricao" placeholderTextColor="#908BA3" style={styles.search} value={search} />
        {loading ? <LoadingState label="Carregando avaliacoes..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={retryRequest} /> : null}
        {!loading && !error && visibleExams.length === 0 ? <View style={styles.empty}><Text style={styles.emptyText}>{exams.length ? "Nenhuma avaliacao corresponde a sua busca." : "Nenhuma avaliacao disponivel no momento."}</Text></View> : null}
        {!loading && !error && visibleExams.map((exam) => <Pressable accessibilityRole="button" key={exam.id} onPress={() => navigation.navigate("Exam", { id: exam.id })} style={styles.exam}><Text style={styles.examTitle}>{exam.title}</Text><Text numberOfLines={2} style={styles.examDescription}>{exam.description}</Text><Text style={styles.deadline}>Prazo: {new Date(exam.deadline).toLocaleString("pt-BR")}</Text><Text style={styles.start}>Realizar avaliacao</Text></Pressable>)}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32 },
  header: { backgroundColor: colors.card, borderRadius: 22, padding: 22 },
  badge: { alignSelf: "flex-start", backgroundColor: "#EEEAFF", borderRadius: 16, color: colors.primary, fontSize: 12, fontWeight: "700", letterSpacing: 0.7, overflow: "hidden", paddingHorizontal: 12, paddingVertical: 7 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 16 },
  description: { color: colors.muted, lineHeight: 22, marginTop: 8 },
  search: { backgroundColor: colors.card, borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, fontSize: 16, marginVertical: 20, padding: 14 },
  empty: { backgroundColor: colors.card, borderRadius: 16, padding: 20 },
  emptyText: { color: colors.muted },
  exam: { backgroundColor: colors.card, borderRadius: 18, marginBottom: 12, padding: 18 },
  examTitle: { color: colors.text, fontSize: 18, fontWeight: "700" },
  examDescription: { color: colors.muted, lineHeight: 20, marginTop: 6 },
  deadline: { color: colors.muted, fontSize: 13, marginTop: 16 },
  start: { color: colors.primary, fontWeight: "700", marginTop: 16 },
});
