import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { ErrorState, LoadingState } from "../components/ScreenState";
import { buscarAvaliacao, enviarRespostas } from "../services/examService";
import { useAuth } from "../session/AuthContext";
import { colors } from "../theme";

export default function StudentExamScreen({ navigation, route }) {
  const { signOut } = useAuth();
  const { id } = route.params;
  const [exam, setExam] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [retry, setRetry] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let active = true;
    buscarAvaliacao(id)
      .then((data) => { if (active) setExam(data); })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.status === 401 || requestError.status === 403) signOut();
        else setLoadError(requestError instanceof TypeError ? "Nao foi possivel conectar a API." : requestError.message);
      });
    return () => { active = false; };
  }, [id, retry, signOut]);

  if (!exam) {
    return <Screen><View style={styles.center}>{loadError ? <ErrorState message={loadError} onRetry={() => { setLoadError(""); setRetry((value) => value + 1); }} /> : <LoadingState label="Carregando avaliacao..." />}</View></Screen>;
  }

  const question = exam.questions[currentQuestion];
  const answered = Object.keys(answers).length;
  const complete = answered === exam.questions.length;

  function selectAnswer(index) {
    setAnswers((current) => ({ ...current, [question.id]: index }));
  }

  async function submit() {
    if (submitting || blocked || !complete) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      const payload = exam.questions.map((item) => ({ questionId: item.id, selectedOptionIndex: answers[item.id] }));
      setResult(await enviarRespostas(id, payload));
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) signOut();
      else {
        setSubmitError(requestError instanceof TypeError ? "Falha de conexao. Suas respostas foram preservadas; tente enviar novamente." : requestError.message);
        setBlocked([400, 404, 409].includes(requestError.status));
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return <Screen><View style={styles.center}><View style={styles.result}><Text style={styles.resultTitle}>Avaliacao finalizada!</Text><Text style={styles.resultText}>Suas respostas e sua pontuacao foram salvas.</Text><Text style={styles.score}>Voce acertou {result.score} de {result.totalQuestions} questoes!</Text><Text style={styles.earned}>+{result.pointsEarned} pontos</Text><Text style={styles.server}>Correcao realizada pelo servidor.</Text><Pressable accessibilityRole="button" onPress={() => navigation.popToTop()} style={styles.primary}><Text style={styles.primaryText}>Voltar as avaliacoes</Text></Pressable></View></View></Screen>;
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{exam.title}</Text>
        <Text style={styles.description}>{exam.description}</Text>
        <Text style={styles.deadline}>Prazo: {new Date(exam.deadline).toLocaleString("pt-BR")}</Text>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: exam.questions.length, now: answered }} style={styles.progress}><View style={[styles.progressValue, { width: `${answered / exam.questions.length * 100}%` }]} /></View>
        <Text style={styles.counter}>Questao {currentQuestion + 1} de {exam.questions.length} - {answered} respondida(s)</Text>
        <View style={styles.card}><Text style={styles.question}>{question.prompt}</Text>{question.options.map((option, index) => { const selected = answers[question.id] === index; return <Pressable accessibilityRole="radio" accessibilityState={{ selected, disabled: submitting || blocked }} disabled={submitting || blocked} key={index} onPress={() => selectAnswer(index)} style={[styles.option, selected && styles.optionSelected]}><Text style={[styles.optionLetter, selected && styles.optionLetterSelected]}>{String.fromCharCode(65 + index)}</Text><Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text></Pressable>; })}</View>
        {submitError ? <Text accessibilityRole="alert" style={styles.error}>{submitError}</Text> : null}
        {!complete ? <Text style={styles.hint}>Responda todas as questoes para finalizar a avaliacao.</Text> : null}
        <View style={styles.actions}><Pressable accessibilityRole="button" disabled={currentQuestion === 0 || submitting || blocked} onPress={() => setCurrentQuestion((value) => value - 1)} style={[styles.secondary, (currentQuestion === 0 || submitting || blocked) && styles.disabled]}><Text style={styles.secondaryText}>Anterior</Text></Pressable>{currentQuestion < exam.questions.length - 1 ? <Pressable accessibilityRole="button" disabled={submitting || blocked} onPress={() => setCurrentQuestion((value) => value + 1)} style={[styles.primary, (submitting || blocked) && styles.disabled]}><Text style={styles.primaryText}>Proxima</Text></Pressable> : <Pressable accessibilityRole="button" disabled={!complete || submitting || blocked} onPress={submit} style={[styles.primary, (!complete || submitting || blocked) && styles.disabled]}>{submitting ? <ActivityIndicator color={colors.card} /> : <Text style={styles.primaryText}>Finalizar avaliacao</Text>}</Pressable>}</View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32 }, center: { flex: 1, justifyContent: "center", padding: 20 }, title: { color: colors.text, fontSize: 27, fontWeight: "700" }, description: { color: colors.muted, lineHeight: 22, marginTop: 8 }, deadline: { color: colors.muted, fontSize: 13, marginTop: 14 }, progress: { backgroundColor: "#EEEAFF", borderRadius: 4, height: 8, marginTop: 24, overflow: "hidden" }, progressValue: { backgroundColor: colors.primary, height: "100%" }, counter: { color: colors.primary, fontWeight: "700", marginTop: 12 }, card: { backgroundColor: colors.card, borderRadius: 20, marginTop: 18, padding: 20 }, question: { color: colors.text, fontSize: 19, fontWeight: "700", lineHeight: 27 }, option: { alignItems: "center", borderColor: colors.border, borderRadius: 12, borderWidth: 1, flexDirection: "row", marginTop: 12, padding: 14 }, optionSelected: { backgroundColor: "#F4F2FF", borderColor: colors.primary }, optionLetter: { borderColor: "#AAA4B8", borderRadius: 16, borderWidth: 1, color: colors.muted, fontWeight: "700", height: 32, lineHeight: 30, marginRight: 12, textAlign: "center", width: 32 }, optionLetterSelected: { backgroundColor: colors.primary, borderColor: colors.primary, color: colors.card }, optionText: { color: colors.text, flex: 1 }, optionTextSelected: { color: colors.primary, fontWeight: "700" }, error: { backgroundColor: "#FEF3F2", borderColor: "#FECDCA", borderRadius: 12, borderWidth: 1, color: colors.danger, marginTop: 18, padding: 12 }, hint: { color: colors.muted, marginTop: 18 }, actions: { flexDirection: "row", gap: 12, justifyContent: "space-between", marginTop: 24 }, primary: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 12, justifyContent: "center", minHeight: 50, paddingHorizontal: 18 }, primaryText: { color: colors.card, fontWeight: "700" }, secondary: { alignItems: "center", borderColor: colors.border, borderRadius: 12, borderWidth: 1, justifyContent: "center", minHeight: 50, paddingHorizontal: 18 }, secondaryText: { color: colors.text, fontWeight: "700" }, disabled: { opacity: 0.45 }, result: { backgroundColor: colors.card, borderRadius: 22, padding: 24 }, resultTitle: { color: colors.text, fontSize: 25, fontWeight: "700", textAlign: "center" }, resultText: { color: colors.muted, lineHeight: 22, marginTop: 10, textAlign: "center" }, score: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: 24, textAlign: "center" }, earned: { color: colors.primary, fontSize: 28, fontWeight: "700", marginTop: 16, textAlign: "center" }, server: { color: colors.muted, fontSize: 13, marginBottom: 22, marginTop: 10, textAlign: "center" },
});
