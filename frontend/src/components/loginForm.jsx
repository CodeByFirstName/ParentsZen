import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 

export default function LoginForm({ switchToSignup, onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Données brutes reçues du backend :", data);


      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      const { token, user } = data;
       console.log("Utilisateur reçu :", user);
      // Utilise la fonction login de ton contexte
      login(token, user.role, user.profileCompleted);
       console.log("Connexion réussie :", user);

      // Redirections selon le rôle et le profil
      if (!user.profileCompleted) {
  if (user.role === "parent") {
    console.log("Redirection vers /complete-profile/parent");
    navigate("/complete-profile/parent");
  } else if (user.role === "babysitter") {
    console.log("Redirection vers /complete-profile/babysitter");
    navigate("/complete-profile/babysitter");
  } else {
    alert("Rôle utilisateur inconnu");
  }
} else if (user.role === "parent") {
  console.log("Redirection vers /parent/dashboard");
  navigate("/parent/dashboard");
} else if (user.role === "babysitter") {
  console.log("Redirection vers /baby-sitter/dashboard");
  navigate("/baby-sitter/dashboard");
} else {
  alert("Rôle utilisateur inconnu");
}

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] flex justify-center items-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-lg max-w-[850px] w-full flex flex-col md:flex-row max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-3xl text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        {/* Image Section */}
        <div className="hidden md:flex flex-1 bg-orange-300 justify-center items-center p-8 rounded-l-2xl">
          <img
            src="/images/login-illustration.jpg"
            alt="Connexion illustration"
            className="w-full max-w-[250px] rounded-xl"
          />
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleLogin}
          className="flex-1 p-8 flex flex-col mt-8 mb-8 max-h-[calc(90vh-60px)] overflow-y-auto"
        >
          <h2 className="mb-6 text-gray-800 font-bold text-2xl">Se connecter</h2>

          <label htmlFor="email" className="mt-3 mb-1 text-gray-700 font-semibold text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="exemple@mail.com"
            required
            className="p-3 rounded-lg border border-gray-300 text-base w-full outline-none focus:border-orange-400 transition"
          />

          <label htmlFor="password" className="mt-4 mb-1 text-gray-700 font-semibold text-sm">
            Mot de passe
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              required
              className="p-3 rounded-lg border border-gray-300 text-base w-full outline-none focus:border-orange-400 transition"
            />
            <span
              className="absolute right-3 text-gray-500 cursor-pointer text-lg"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-8 bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-bold text-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="mt-4">
            <a href="/forgot-password" className="text-orange-500 text-sm underline">
              Mot de passe oublié ?
            </a>
            <p className="mt-2 text-sm text-gray-700">
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={switchToSignup}
                className="text-orange-500 font-semibold underline text-sm"
              >
                Créez-en un
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
