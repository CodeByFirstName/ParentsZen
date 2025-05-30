// src/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Home from "./pages/homePage";
import BabysitterDashboard from "./pages/babysitterDashboard";
import BabysitterList from "./pages/babysitterList";
import Favorites from "./pages/favorites";
import Reviews from "./pages/reviews";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import BabysitterProfilePage from "./pages/babysitterProfilPage";
import BabysitterProfileForm from "./components/babysitterProfilForm";
import ParentProfileForm from "./components/parentProfilForm";
import DashboardLayout from "./components/dashboardLayout";
import LoginForm from "./components/loginForm";
import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Home />} />
      <Route path="/babysitters/:id" element={<BabysitterProfilePage />} />

      {/* Formulaires de complétion de profil accessibles sans protection */}
      <Route path="/complete-profile/babysitter" element={<BabysitterProfileForm />} />
      <Route path="/complete-profile/parent" element={<ParentProfileForm />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard baby-sitter */}
        <Route path="/baby-sitter/dashboard" element={<BabysitterDashboard />} />

        {/* Dashboard parent avec sous-routes */}
        <Route path="/parent/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Navigate to="babysitters" replace />} />
          <Route path="babysitters" element={<BabysitterList />} />
          <Route path="favoris" element={<Favorites />} />
          <Route path="avis" element={<Reviews />} />
          <Route path="profil" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Catch all - redirige vers la page d'accueil si aucune route ne correspond */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
