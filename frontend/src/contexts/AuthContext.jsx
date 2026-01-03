// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const storedToken = localStorage.getItem("token");
  const storedRole = localStorage.getItem("role");

  if (storedToken && storedRole) {
    console.log("🔐 AuthContext init avec token et rôle");

    setToken(storedToken);
    setRole(storedRole);

    // On attend d'avoir les infos du serveur avant de décider si le profil est complet
    fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Échec de la récupération du profil");
        return res.json();
      })
      .then((data) => {
        const complete = data.profileCompleted === true;
        console.log("✅ Profil récupéré via useEffect:", complete);

        setIsProfileComplete(complete);
        localStorage.setItem("isProfileComplete", complete.toString());
      })
      .catch((err) => {
        console.error("❌ Erreur AuthContext (fetch profile):", err);
        // Si l’appel échoue, mieux vaut bloquer l’accès
        setIsProfileComplete(false);
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    setLoading(false);
  }
}, []);


  const login = async (token, role, profileCompleted = null) => {
    try {
      console.log("🔓 login() appelé");
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setToken(token);
      setRole(role);

      let complete;

      if (profileCompleted !== null) {
        complete = profileCompleted === true;
        console.log("⚡ login: profil fourni depuis réponse login:", complete);
      } else {
        console.log("📡 login: appel à /api/users/me pour récupérer le profil");

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Échec de la récupération du profil après login");
        }

        const data = await res.json();
        complete = data.profileCompleted === true;
        console.log("📥 login: profil récupéré depuis /api/users/me:", complete);
      }

      setIsProfileComplete(complete);
      localStorage.setItem("isProfileComplete", complete.toString());
    } catch (err) {
      console.error("❌ Erreur login():", err);
      setIsProfileComplete(false);
      localStorage.setItem("isProfileComplete", "false");
    }
  };

  const logout = () => {
    console.log("🚪 Déconnexion");
    localStorage.clear();
    setToken(null);
    setRole(null);
    setIsProfileComplete(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, isProfileComplete,setIsProfileComplete, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
