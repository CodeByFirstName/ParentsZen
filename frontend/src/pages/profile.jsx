import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { font } from '../styles/designSystem';

export default function ParentProfilePage() {
  const [formData, setFormData] = useState({
    photo: '',
    location: '',
    numberOfChildren: '',
    budget: '',
    availability: [
      { day: '', startTime: '', endTime: '' }
    ]
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const user = data.user;

        setFormData({
          photo: user.profile?.photo || '',
          location: user.profile?.location || '',
          numberOfChildren: user.profile?.numberOfChildren || '',
          budget: user.profile?.budget || '',
          availability: user.profile?.availability?.length ? user.profile.availability : [{ day: '', startTime: '', endTime: '' }]
        });
      } catch {
        toast.error("Erreur de chargement du profil");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...formData.availability];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, availability: updated }));
  };

  const handleAddAvailability = () => {
    setFormData(prev => ({
      ...prev,
      availability: [...prev.availability, { day: '', startTime: '', endTime: '' }]
    }));
  };

  const handleRemoveAvailability = (index) => {
    const updated = formData.availability.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, availability: updated }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('photo', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.url) {
        setFormData(prev => ({ ...prev, photo: json.url }));
        toast.success("📸 Photo uploadée !");
      } else {
        toast.error("❌ Upload échoué");
      }
    } catch {
      toast.error("❌ Erreur réseau lors de l’upload");
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile: formData }),
      });
      if (!res.ok) throw new Error();
      toast.success("✅ Modifications enregistrées !");
    } catch {
      toast.error("❌ Erreur lors de l'enregistrement");
    }
  };

  return (
    <section className="py-10 px-4 md:px-10" style={{ fontFamily: font.family }}>
      <h2 className="text-3xl font-bold mb-2 text-center text-orange-600">👨‍👩‍👧‍👦 Mon Profil Parent</h2>
      <p className="text-center text-gray-600 mb-8">Modifiez vos informations personnelles ici.</p>

      <div className="max-w-3xl mx-auto space-y-5">
        {formData.photo && (
          <div className="text-center">
            <img src={formData.photo} alt="Profil" className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-2 border-orange-400" />
          </div>
        )}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Photo de profil</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <Input label="Ville" name="location" value={formData.location} onChange={handleChange} />
        <Input label="Nombre d'enfants" name="numberOfChildren" type="number" value={formData.numberOfChildren} onChange={handleChange} />
        <Input label="Budget (FCFA)" name="budget" type="number" value={formData.budget} onChange={handleChange} />

        <div>
          <label className="block font-medium text-gray-700 mb-2">Disponibilités</label>
          {formData.availability.map((slot, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <select value={slot.day} onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)} className="border p-2 rounded">
                <option value="">Jour</option>
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              
              <button onClick={() => handleRemoveAvailability(index)} className="text-red-500 hover:underline text-sm col-span-3 text-left">❌ Supprimer</button>
            </div>
          ))}
          <button onClick={handleAddAvailability} className="text-blue-600 text-sm hover:underline">➕ Ajouter une disponibilité</button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition"
          >
            💾 Sauvegarder
          </button>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </section>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center border border-gray-300 rounded-lg p-2">
        <input {...props} className="w-full outline-none" />
        <span className="ml-2 text-gray-400">✏️</span>
      </div>
    </div>
  );
}
