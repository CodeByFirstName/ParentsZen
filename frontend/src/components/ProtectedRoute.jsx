// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { token, role, isProfileCompleted, loading } = useAuth();

  // Attendre que les infos soient chargées
  if (loading) return null;

  // Si non connecté, redirige vers login
  if (!token) return <Navigate to="/login" replace />;

  // Si profil non complété, redirige vers le bon formulaire
  if (!isProfileCompleted) {
    return role === "parent"
      ? <Navigate to="/complete-profile/parent" replace />
      : <Navigate to="/complete-profile/babysitter" replace />;
  }

  // Sinon, laisse passer vers les routes enfants
  return <Outlet />;
}
