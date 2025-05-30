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
      setToken(storedToken);
      setRole(storedRole);

      fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Échec de la récupération du profil");
          return res.json();
        })
        .then((data) => {
          const complete = data.profileCompleted === true; // attention au "d"
          setIsProfileComplete(complete);
          localStorage.setItem("isProfileComplete", complete.toString());
        })
        .catch((err) => {
          console.error("Erreur AuthContext:", err);
          const cachedComplete = localStorage.getItem("isProfileComplete") === "true";
          setIsProfileComplete(cachedComplete);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token, role) => {
    try {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setToken(token);
      setRole(role);

      // On récupère les infos du profil pour savoir si c'est complet
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Échec de la récupération du profil après login");
      }

      const data = await res.json();
      const complete = data.profileCompleted === true;
      setIsProfileComplete(complete);
      localStorage.setItem("isProfileComplete", complete.toString());
    } catch (err) {
      console.error("Erreur login():", err);
      // En cas d'erreur, on suppose profil incomplet par sécurité
      setIsProfileComplete(false);
      localStorage.setItem("isProfileComplete", "false");
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setIsProfileComplete(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, isProfileComplete, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
