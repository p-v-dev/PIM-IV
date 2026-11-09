import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ErrorState, LoadingState } from "./ScreenState";
import { buscarLeaderboard } from "../services/examService";
import { useAuth } from "../session/AuthContext";
import { colors } from "../theme";

export default function Leaderboard() {
  const { signOut } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    buscarLeaderboard()
      .then((ranking) => {
        if (active) setStudents(ranking);
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
    <View style={styles.card}>
      <Text style={styles.title}>Ranking de estudantes</Text>
      <Text style={styles.subtitle}>Acompanhe a pontuacao da comunidade.</Text>
      <View style={styles.content}>
        {loading ? <LoadingState label="Carregando ranking..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={retryRequest} /> : null}
        {!loading && !error && students.length === 0 ? <Text style={styles.empty}>Ainda nao ha alunos no ranking.</Text> : null}
        {!loading && !error && students.map((student, index) => (
          <View key={student.studentId} style={styles.row}>
            <View style={styles.student}>
              <Text style={styles.position}>{index + 1}</Text>
              <Text numberOfLines={1} style={styles.name}>{student.name}</Text>
            </View>
            <Text style={styles.points}>{student.points} pts</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 22, padding: 20 },
  title: { color: colors.text, fontSize: 21, fontWeight: "700" },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 4 },
  content: { marginTop: 18 },
  empty: { color: colors.muted, fontSize: 14 },
  row: { alignItems: "center", borderTopColor: colors.border, borderTopWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingVertical: 14 },
  student: { alignItems: "center", flex: 1, flexDirection: "row", marginRight: 12 },
  position: { backgroundColor: "#EEEAFF", borderRadius: 18, color: colors.primary, fontWeight: "700", height: 36, lineHeight: 36, marginRight: 12, overflow: "hidden", textAlign: "center", width: 36 },
  name: { color: colors.text, flex: 1, fontWeight: "600" },
  points: { color: colors.primary, fontWeight: "700" },
});
