// ParentProfileForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const DAYS_OF_WEEK = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export default function ParentProfileForm({ onClose, onComplete }) {
  const { setIsProfileComplete } = useAuth();
  const [formData, setFormData] = useState({
    photo: null,
    location: "",
    numberOfChildren: "",
    budget: "",
    favorites: "",
    availability: [{ day: "" }],
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleAvailabilityChange = (index, value) => {
    const updated = [...formData.availability];
    updated[index].day = value;
    setFormData((prev) => ({ ...prev, availability: updated }));
  };

  const addAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [...prev.availability, { day: "" }],
    }));
  };

  const removeAvailability = (index) => {
    const updated = [...formData.availability];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, availability: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const dataToSend = new FormData();
      for (let key in formData) {
        if (key === "availability") {
          dataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "favorites") {
          const favArray = formData.favorites
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id !== "");
          dataToSend.append(key, JSON.stringify(favArray));
        } else {
          dataToSend.append(key, formData[key]);
        }
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/complete-profile`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
        setIsProfileComplete(true);
        localStorage.setItem("isProfileComplete", "true");

      if (onComplete) onComplete();
      if (onClose) onClose(); // Ferme la modal si fourni
      navigate("/parent/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la soumission du profil.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-8 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-10 overflow-y-auto max-h-[90vh]">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-orange-500 mb-2">
            Complétez votre profil parent 👨‍👩‍👧
          </h1>
          <p className="text-sm text-gray-600">
            Renseignez quelques informations pour vous aider à trouver les meilleurs babysitters 👶✨
          </p>
        </div>

        {message && (
          <div className="mb-6 text-center text-sm font-medium text-red-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Photo</label>
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              accept="image/*"
              className="block w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="block w-full rounded border border-gray-300 p-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Votre ville"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Nombre d'enfants <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numberOfChildren"
              value={formData.numberOfChildren}
              onChange={handleChange}
              min={0}
              required
              className="block w-full rounded border border-gray-300 p-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Exemple : 2"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Budjet horaire (FCFA)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min={0}
              className="block w-full rounded border border-gray-300 p-3 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Exemple : 1500"
            />
          </div>

          <div>
            <label className="block mb-3 font-semibold text-gray-700">créneaux souhaités</label>
            {formData.availability.map((slot, index) => (
              <div key={index} className="mb-4 flex items-center gap-4">
                <select
                  className="flex-grow rounded border border-gray-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={slot.day}
                  onChange={(e) => handleAvailabilityChange(index, e.target.value)}
                  required
                >
                  <option value="" disabled>Sélectionnez un jour</option>
                  {DAYS_OF_WEEK.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeAvailability(index)}
                  className="text-red-500 hover:text-red-700 font-bold text-sm"
                  title="Supprimer ce  créneau"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAvailability}
              className="text-sm text-orange-500 hover:text-orange-600 font-semibold underline"
            >
              + Ajouter un créneau
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-orange-400 py-4 text-white font-bold text-lg hover:bg-orange-500 transition"
          >
            Enregistrer le profil
          </button>
        </form>
      </div>
    </div>
  );
}
