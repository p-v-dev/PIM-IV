import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert, Pressable, Text } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import StudentHomeScreen from "../screens/StudentHomeScreen";
import StudentEvaluationsScreen from "../screens/StudentEvaluationsScreen";
import StudentExamScreen from "../screens/StudentExamScreen";
import StudentPerformanceScreen from "../screens/StudentPerformanceScreen";
import StudentFaqScreen from "../screens/StudentFaqScreen";
import { isDemoMode } from "../config/api";
import { useAuth } from "../session/AuthContext";
import { colors } from "../theme";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const EvaluationStack = createNativeStackNavigator();

function EvaluationsStack() {
  return (
    <EvaluationStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.card }, headerTintColor: colors.text, headerTitleStyle: { fontWeight: "700" } }}>
      <EvaluationStack.Screen name="EvaluationsList" component={StudentEvaluationsScreen} options={{ title: "Avaliacoes" }} />
      <EvaluationStack.Screen name="Exam" component={StudentExamScreen} options={{ title: "Avaliacao" }} />
    </EvaluationStack.Navigator>
  );
}

function StudentTabs() {
  const { signOut } = useAuth();

  function confirmSignOut() {
    Alert.alert("Sair da conta", "Deseja encerrar sua sessao?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.card }, headerTintColor: colors.text, headerTitleStyle: { fontWeight: "700" }, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, headerRight: () => !isDemoMode && <Pressable accessibilityRole="button" accessibilityLabel="Sair da conta" onPress={confirmSignOut}><Text style={{ color: colors.primary, fontWeight: "700", marginRight: 16 }}>Sair</Text></Pressable> }}>
      <Tab.Screen name="Home" component={StudentHomeScreen} options={{ title: "EduQuest" }} />
      <Tab.Screen name="Evaluations" component={EvaluationsStack} options={{ headerShown: false, title: "Avaliacoes" }} />
      <Tab.Screen name="Performance" component={StudentPerformanceScreen} options={{ title: "Desempenho" }} />
      <Tab.Screen name="Faq" component={StudentFaqScreen} options={{ title: "FAQ" }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user?.role === "student" ? <Stack.Screen name="StudentArea" component={StudentTabs} /> : <Stack.Screen name="Login" component={LoginScreen} />}
    </Stack.Navigator>
  );
}
