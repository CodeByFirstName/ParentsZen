import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { token, role, isProfileComplete, loading } = useAuth();

  // Attendre que les infos soient chargées
  if (loading) return null;

  // Si non connecté, redirige vers la page d'accueil
  if (!token) return <Navigate to="/" replace />;

  // Si tu veux forcer la complétion du profil, décommente ceci :
  /*
  if (!isProfileComplete) {
    return role === "parent"
      ? <Navigate to="/complete-profile/parent" replace />
      : <Navigate to="/complete-profile/babysitter" replace />;
  }
  */

  // Accès autorisé
  return <Outlet />;
}
