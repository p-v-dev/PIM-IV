import { Navigate, useLoaderData } from "react-router";

function App() {
  const user = useLoaderData();
  return <Navigate to={user.role === "student" ? "/aluno" : "/professor"} replace />;
}

export default App;
