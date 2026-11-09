import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export function LoadingState({ label = "Carregando..." }) {
  return <View accessibilityRole="progressbar" style={styles.container}><ActivityIndicator color={colors.primary} /><Text style={styles.text}>{label}</Text></View>;
}

export function ErrorState({ message, onRetry }) {
  return <View accessibilityRole="alert" style={styles.container}><Text style={styles.error}>{message}</Text>{onRetry && <Pressable accessibilityRole="button" onPress={onRetry}><Text style={styles.retry}>Tentar novamente</Text></Pressable>}</View>;
}

const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: colors.card, borderRadius: 16, gap: 12, padding: 24 },
  text: { color: colors.muted },
  error: { color: colors.danger, textAlign: "center" },
  retry: { color: colors.primary, fontWeight: "700" },
});
