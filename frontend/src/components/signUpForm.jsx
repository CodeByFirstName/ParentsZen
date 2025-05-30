import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";






export default function SignUpForm({ switchToLogin, onClose, onRegister }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Réponse backend inscription :", data);

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue.");
      }

      setMessage("Inscription réussie !");

       // Ici on stocke l'email dans localStorage
    localStorage.setItem('userEmail', formData.email);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        gender: "",
        role: "",
      });

      
        // 👇 Appel de onRegister après inscription réussie
        if (typeof onRegister === "function") {
        onRegister(); 
        }

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-orange-300 p-6">
          <img
            src="/images/signup-illustration.jpg"
            alt="Inscription illustration"
            className="w-full max-w-xs rounded-xl"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto max-h-[90vh]"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Créer un compte</h2>

          {message && (
            <div className="mb-4 text-sm text-red-600">{message}</div>
          )}

          <label htmlFor="name" className="font-medium text-sm text-gray-700">
            Nom complet
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom complet"
            required
            className="mb-4 mt-1 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
          />

          <label htmlFor="email" className="font-medium text-sm text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@mail.com"
            required
            className="mb-4 mt-1 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
          />

          <label htmlFor="password" className="font-medium text-sm text-gray-700">
            Mot de passe
          </label>
          <div className="relative mb-4 mt-1">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="p-3 pr-10 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <label htmlFor="confirmPassword" className="font-medium text-sm text-gray-700">
            Confirmer le mot de passe
          </label>
          <div className="relative mb-4 mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="p-3 pr-10 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <label htmlFor="phone" className="font-medium text-sm text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="ex : +229 90 00 00 00"
            required
            className="mb-4 mt-1 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
          />

          <label htmlFor="gender" className="font-medium text-sm text-gray-700">
            Genre
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mb-4 mt-1 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="">-- Sélectionnez votre genre --</option>
            <option value="Femme">Femme</option>
            <option value="Homme">Homme</option>
          </select>

          <label htmlFor="role" className="font-medium text-sm text-gray-700">
            Rôle
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="mb-6 mt-1 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <option value="">-- Choisissez un rôle --</option>
            <option value="parent">Parent</option>
            <option value="babysitter">Baby-sitter</option>
          </select>

          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors"
          >
            S'inscrire
          </button>

          <div className="mt-4 text-sm text-gray-600">
            <a href="/forgot-password" className="text-orange-500 underline">
              Mot de passe oublié ?
            </a>
            <p className="mt-2">
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={switchToLogin}
                className="text-orange-500 font-semibold underline"
              >
                Connectez-vous
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
