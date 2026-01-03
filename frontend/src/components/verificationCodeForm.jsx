import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerificationCodeForm({ onClose }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Code invalide");

      // ✅ Redirection directe vers la page de connexion
      navigate("/login");

    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Échec du renvoi");

      setMessage("Code renvoyé avec succès.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[1000] flex justify-center items-center p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl shadow-lg max-w-[600px] w-full p-8">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-3xl text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Vérification du compte</h2>
        <p className="text-sm text-gray-600 mb-4">
          Un code vous a été envoyé par mail. Veuillez le saisir ci-dessous :
        </p>

        {message && (
          <p className="text-sm mb-4 text-center text-red-600">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Entrez le code de vérification"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg outline-none focus:border-orange-400 transition"
          />

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-bold text-lg transition"
          >
            Vérifier
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendCode}
            className="text-sm text-orange-500 underline hover:text-orange-600"
          >
            Renvoyer le code
          </button>
        </div>
      </div>
    </div>
  );
}
