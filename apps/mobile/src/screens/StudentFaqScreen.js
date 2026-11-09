import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { colors } from "../theme";

const questions = [
  ["Como acessar minhas avaliacoes?", "Acesse a secao Avaliacoes para consultar os questionarios disponiveis e verificar os prazos de realizacao."],
  ["Como responder a uma avaliacao?", "Selecione a avaliacao desejada e siga as instrucoes apresentadas na tela para responder as questoes."],
  ["Posso realizar uma avaliacao mais de uma vez?", "Cada avaliacao permite uma unica tentativa. Confira as orientacoes antes de comecar."],
  ["Onde posso consultar minha pontuacao?", "Consulte a area de desempenho ou os resultados disponibilizados para verificar sua pontuacao."],
  ["Como funciona o ranking de estudantes?", "O ranking apresenta a classificacao dos estudantes de acordo com a pontuacao registrada no EduQuest."],
  ["O que fazer se uma avaliacao nao aparecer?", "Verifique se a avaliacao esta disponivel e dentro do prazo. Se o problema continuar, entre em contato com o professor ou responsavel pela plataforma."],
];

export default function StudentFaqScreen() {
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.badge}>CENTRAL DE AJUDA</Text>
          <Text style={styles.title}>Perguntas frequentes</Text>
          <Text style={styles.description}>Encontre respostas para as principais duvidas sobre o EduQuest e sua jornada de aprendizagem.</Text>
        </View>
        <View accessibilityLabel="Lista de perguntas frequentes" style={styles.list}>
          {questions.map(([question, answer], index) => {
            const expanded = openQuestion === index;
            return <View key={question} style={styles.item}><Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setOpenQuestion(expanded ? null : index)} style={styles.question}><Text style={styles.questionText}>{question}</Text><Text style={[styles.chevron, expanded && styles.chevronOpen]}>v</Text></Pressable>{expanded ? <Text style={styles.answer}>{answer}</Text> : null}</View>;
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 32 },
  header: { backgroundColor: colors.card, borderRadius: 22, padding: 22 },
  badge: { alignSelf: "flex-start", backgroundColor: "#EEEAFF", borderRadius: 16, color: colors.primary, fontSize: 12, fontWeight: "700", letterSpacing: 0.7, overflow: "hidden", paddingHorizontal: 12, paddingVertical: 7 },
  title: { color: colors.text, fontSize: 27, fontWeight: "700", marginTop: 16 },
  description: { color: colors.muted, lineHeight: 22, marginTop: 8 },
  list: { gap: 12, marginTop: 20 },
  item: { backgroundColor: colors.card, borderRadius: 18, overflow: "hidden" },
  question: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", minHeight: 64, paddingHorizontal: 18, paddingVertical: 14 },
  questionText: { color: colors.text, flex: 1, fontSize: 16, fontWeight: "700", paddingRight: 12 },
  chevron: { backgroundColor: "#EEEAFF", borderRadius: 16, color: colors.primary, fontSize: 22, height: 32, lineHeight: 26, overflow: "hidden", textAlign: "center", width: 32 },
  chevronOpen: { transform: [{ rotate: "180deg" }] },
  answer: { borderTopColor: colors.border, borderTopWidth: 1, color: colors.muted, lineHeight: 22, marginHorizontal: 18, paddingBottom: 18, paddingTop: 14 },
});
