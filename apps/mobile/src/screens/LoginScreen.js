import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Screen from "../components/Screen";
import { useAuth } from "../session/AuthContext";
import { colors } from "../theme";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (loading) return;
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha seu e-mail e sua senha para continuar.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      setPassword("");
    } catch (submitError) {
      setError(submitError instanceof TypeError ? "Nao foi possivel conectar a API. Tente novamente." : submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.overline}>BEM-VINDO AO</Text>
            <Text style={styles.brand}>EduQuest</Text>
            <Text style={styles.description}>Realize avaliacoes, acompanhe seu desempenho e dispute posicoes no ranking.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Entrar na plataforma</Text>
            <Text style={styles.subtitle}>Informe seus dados para acessar sua area de estudante.</Text>

            <Text style={styles.label}>Entrar como</Text>
            <View accessibilityRole="radiogroup" style={styles.role}>
              <Text accessibilityRole="radio" accessibilityState={{ selected: true }} style={styles.roleText}>Aluno</Text>
            </View>

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              accessibilityLabel="E-mail"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#908BA3"
              style={styles.input}
              textContentType="emailAddress"
              value={email}
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordRow}>
              <TextInput
                accessibilityLabel="Senha"
                autoComplete="current-password"
                editable={!loading}
                onChangeText={setPassword}
                onSubmitEditing={handleSubmit}
                placeholder="Digite sua senha"
                placeholderTextColor="#908BA3"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                textContentType="password"
                value={password}
              />
              <Pressable accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"} disabled={loading} onPress={() => setShowPassword((value) => !value)} style={styles.passwordToggle}>
                <Text style={styles.passwordToggleText}>{showPassword ? "Ocultar" : "Mostrar"}</Text>
              </Pressable>
            </View>

            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

            <Pressable accessibilityRole="button" accessibilityState={{ disabled: loading }} disabled={loading} onPress={handleSubmit} style={({ pressed }) => [styles.submit, (pressed || loading) && styles.submitPressed]}>
              {loading ? <ActivityIndicator color={colors.card} /> : <Text style={styles.submitText}>Entrar</Text>}
            </Pressable>

            <Text style={styles.footer}>EduQuest - Plataforma de aprendizagem</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: "center", padding: 20 },
  hero: { backgroundColor: colors.primary, borderRadius: 24, padding: 28 },
  overline: { color: "#E9E5FF", fontSize: 12, fontWeight: "700", letterSpacing: 1.5 },
  brand: { color: colors.card, fontSize: 36, fontWeight: "700", marginTop: 8 },
  description: { color: "#E9E5FF", fontSize: 16, lineHeight: 24, marginTop: 16 },
  card: { backgroundColor: colors.card, borderRadius: 24, marginTop: 16, padding: 24 },
  title: { color: colors.text, fontSize: 26, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: 8 },
  label: { color: colors.text, fontSize: 14, fontWeight: "700", marginTop: 22, marginBottom: 8 },
  role: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 12, padding: 14 },
  roleText: { color: colors.card, fontSize: 15, fontWeight: "700" },
  input: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, color: colors.text, fontSize: 16, padding: 14 },
  passwordRow: { alignItems: "center", borderColor: colors.border, borderRadius: 12, borderWidth: 1, flexDirection: "row" },
  passwordInput: { color: colors.text, flex: 1, fontSize: 16, padding: 14 },
  passwordToggle: { minHeight: 48, justifyContent: "center", paddingHorizontal: 14 },
  passwordToggleText: { color: colors.primary, fontWeight: "700" },
  error: { backgroundColor: "#FEF3F2", borderColor: "#FECDCA", borderRadius: 12, borderWidth: 1, color: colors.danger, lineHeight: 20, marginTop: 20, padding: 12 },
  submit: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 12, justifyContent: "center", marginTop: 24, minHeight: 52 },
  submitPressed: { opacity: 0.7 },
  submitText: { color: colors.card, fontSize: 16, fontWeight: "700" },
  footer: { color: colors.muted, fontSize: 12, marginTop: 24, textAlign: "center" },
});
