import { StyleSheet, Text, View } from "react-native";
import Screen from "../components/Screen";
import { colors } from "../theme";

export default function PlaceholderScreen({ title }) {
  return <Screen><View style={styles.container}><Text style={styles.title}>{title}</Text><Text style={styles.text}>Esta tela sera portada nas proximas etapas.</Text></View></Screen>;
}

const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: colors.background, flex: 1, justifyContent: "center", padding: 24 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700" },
  text: { color: colors.muted, fontSize: 16, marginTop: 8, textAlign: "center" },
});
