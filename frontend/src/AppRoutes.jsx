// src/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Home from "./pages/homePage";

import BabysitterDashboard from "./pages/babysitterDashboard";
import BabysitterList from "./pages/babysitterList";
import Favorites from "./pages/favorites";
import Reviews from "./pages/reviews";
import Profile from "./pages/profile";
import BabysitterProfilePage from "./pages/babysitterProfilPage";
import BabysitterProfileForm from "./components/babysitterProfilForm";
import ParentProfileForm from "./components/parentProfilForm";
import DashboardLayout from "./components/dashboardLayout";
import LoginForm from "./components/loginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import BabysitterDashboardLayout from "./components/babysitterDashboardLayout";
import Requests from "./pages/demandesRecues";
import BabysitterReviews from "./pages/babysitterReviews";
import BabysitterProfile from "./pages/babysitterProfile";

export default function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<LoginForm />} />
      <Route path="/babysitters/:id" element={<BabysitterProfilePage />} />

      <Route path="/complete-profile/babysitter" element={<BabysitterProfileForm />} />
      <Route path="/complete-profile/parent" element={<ParentProfileForm />} />

      {/* Routes protégées */}
      <Route element={<ProtectedRoute />}>
        <Route path="/baby-sitter/dashboard/*" element={<BabysitterDashboardLayout />}>
          <Route index element={<Navigate to="requests" replace />} />
          <Route path="requests" element={<Requests />} />
          <Route path="reviews" element={<BabysitterReviews />} />
          <Route path="profil" element={<BabysitterProfile />} />
        </Route>

        <Route path="/parent/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Navigate to="babysitters" replace />} />
          <Route path="babysitters" element={<BabysitterList />} />
          <Route path="favoris" element={<Favorites />} />
          <Route path="avis" element={<Reviews />} />
          <Route path="profil" element={<Profile />} />
          <Route path="babysitters/:id" element={<BabysitterProfilePage />} />
        </Route>
      </Route>

      {/* Redirection inconnue */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
