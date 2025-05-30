import React, { useState } from "react";

export default function BabysitterProfileForm({ onComplete }) {
  const [formData, setFormData] = useState({
    photo: null,
    location: "",
    skills: "",
    experience: "",
    availability: [{ day: "", startTime: "", endTime: "" }],
    hourlyRate: "",
    description: "",
    maxChildren: 1,
    educationLevel: "",
    languages: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...formData.availability];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, availability: updated }));
  };

  const addAvailability = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [...prev.availability, { day: "", startTime: "", endTime: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.hourlyRate < 1000) {
      setMessage("Le tarif horaire doit être au moins 1000 FCFA.");
      return;
    }

    try {
      const dataToSend = new FormData();
      for (let key in formData) {
        if (key === "availability") {
          dataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          dataToSend.append(key, formData[key]);
        }
      }

      const response = await fetch("http://localhost:5000/api/users/babysitter/profile", {
        method: "POST",
        body: dataToSend,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de la soumission du profil.");

      setMessage("Profil complété avec succès !");
      if (onComplete) onComplete();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Bienvenue chère baby-sitter !</h2>

        {message && <div className="mb-4 text-sm text-red-600">{message}</div>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Photo</label>
          <input type="file" name="photo" onChange={handleChange} accept="image/*" className="mb-4" />

          <label className="block mb-2">Ville</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="mb-4 p-2 border rounded w-full" required />

          <label className="block mb-2">Compétences</label>
          <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Ex : Jeux éducatifs, premiers soins..." className="mb-4 p-2 border rounded w-full" required />

          <label className="block mb-2">Années d'expérience</label>
          <input type="number" name="experience" value={formData.experience} onChange={handleChange} className="mb-4 p-2 border rounded w-full" required />

          <label className="block mb-2">Disponibilités</label>
          {formData.availability.map((slot, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" placeholder="Jour" value={slot.day} onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)} className="p-2 border rounded w-1/3" required />
              <input type="time" value={slot.startTime} onChange={(e) => handleAvailabilityChange(index, "startTime", e.target.value)} className="p-2 border rounded w-1/3" required />
              <input type="time" value={slot.endTime} onChange={(e) => handleAvailabilityChange(index, "endTime", e.target.value)} className="p-2 border rounded w-1/3" required />
            </div>
          ))}
          <button type="button" onClick={addAvailability} className="mb-4 text-sm text-blue-600 underline">+ Ajouter une disponibilité</button>

          <label className="block mb-2">Tarif horaire (FCFA)</label>
          <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} className="mb-4 p-2 border rounded w-full" required />

          <label className="block mb-2">Pourquoi faites-vous ce métier ?</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="mb-4 p-2 border rounded w-full" required />

          <label className="block mb-2">Nombre maximum d'enfants gardés</label>
          <input type="number" name="maxChildren" value={formData.maxChildren} onChange={handleChange} className="mb-4 p-2 border rounded w-full" required />

          <label className="block mb-2">Niveau d'études</label>
          <input type="text" name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="mb-4 p-2 border rounded w-full" required />

          <label className="block mb-2">Langues parlées (séparées par une virgule)</label>
          <input type="text" name="languages" value={formData.languages} onChange={handleChange} className="mb-6 p-2 border rounded w-full" required />

          <button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 rounded-xl w-full">
            Enregistrer le profil
          </button>
        </form>
      </div>
    </div>
  );
}
