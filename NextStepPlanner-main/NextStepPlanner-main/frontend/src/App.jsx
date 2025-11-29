import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PomodoroProvider } from "./contexts/PomodoroContext";
import { PageLoader } from "./components/ui/Loader";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Planner from "./pages/Planner/Planner";
import Pomodoro from "./pages/Pomodoro/Pomodoro";
import Mood from "./pages/Mood/Mood";
import Resume from "./pages/Resume/Resume";
import Skills from "./pages/Skills/Skills";
import Layout from "./components/Layout";

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageLoader text="Initializing NextStep Planner..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <PomodoroProvider>
              <Layout />
            </PomodoroProvider>
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="planner" element={<Planner />} />
        <Route path="pomodoro" element={<Pomodoro />} />
        <Route path="mood" element={<Mood />} />
        <Route path="resume" element={<Resume />} />
        <Route path="skills" element={<Skills />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
