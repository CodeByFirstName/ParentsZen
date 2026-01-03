import React, { useEffect, useState } from 'react';
import { font } from '../styles/designSystem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function BabysitterProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    skills: [''],
    experience: 0,
    availability: [''],
    hourlyRate: '',
    description: '',
    maxChildren: '',
    educationLevel: '',
    languages: [''],
    photo: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const user = data.user;

        setFormData({
          name: user.name || '',
          location: user.babysitterProfile?.location || '',
          skills: user.babysitterProfile?.skills || [''],
          experience: user.babysitterProfile?.experience || 0,
          availability: user.babysitterProfile?.availability || [''],
          hourlyRate: user.babysitterProfile?.hourlyRate || '',
          description: user.babysitterProfile?.description || '',
          maxChildren: user.babysitterProfile?.maxChildren || '',
          educationLevel: user.babysitterProfile?.educationLevel || '',
          languages: user.babysitterProfile?.languages || [''],
          photo: user.babysitterProfile?.photo || '',
        });
      } catch (err) {
        toast.error("Erreur lors du chargement du profil");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: updatedArray }));
  };

  const addToArray = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
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
      toast.success("📸 Image uploadée sur Cloudinary !");
    } else {
      toast.error("❌ Upload échoué");
    }
  } catch (err) {
    console.error(err);
    toast.error("❌ Erreur réseau lors de l’upload");
  }
};


  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Données envoyées :", formData);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
       body: JSON.stringify({
  babysitterProfile: {
    location: formData.location,
    skills: formData.skills,
    experience: formData.experience,
    availability: formData.availability,
    hourlyRate: formData.hourlyRate,
    description: formData.description,
    maxChildren: formData.maxChildren,
    educationLevel: formData.educationLevel,
    languages: formData.languages,
    photo: formData.photo,
  }
}),

      });
      if (!res.ok) throw new Error("Échec de la sauvegarde");
      toast.success("✅ Modifications enregistrées !");
    } catch (err) {
      toast.error("❌ Erreur lors de l'enregistrement");
    }
  };

  return (
    <section className="py-10 px-4 md:px-10" style={{ fontFamily: font.family }}>
      <h2 className="text-3xl font-bold mb-2 text-center text-orange-600">🧑‍🍼 Mon Profil Babysitter</h2>
      <p className="text-center text-gray-600 mb-8">
        Ici, vous pouvez consulter et modifier vos informations personnelles de baby-sitter.
      </p>

      <div className="max-w-3xl mx-auto space-y-5">
        {formData.photo && (
          <div className="text-center">
            <img src={formData.photo} alt="Profil" className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-2 border-orange-400" />
          </div>
        )}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Photo de profil</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="block" />
        </div>

        <Input label="Nom" name="name" value={formData.name} onChange={handleChange} />
        <Input label="Ville" name="location" value={formData.location} onChange={handleChange} />
        <Input label="Tarif horaire (FCFA)" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} />
        <Input label="Expérience (en années)" name="experience" type="number" value={formData.experience} onChange={handleChange} />
        <Input label="Nombre maximum d'enfants" name="maxChildren" type="number" value={formData.maxChildren} onChange={handleChange} />
        <Input label="Niveau d'éducation" name="educationLevel" value={formData.educationLevel} onChange={handleChange} />
        <TextArea label="Description" name="description" value={formData.description} onChange={handleChange} />

        <ArrayField label="Compétences" field="skills" values={formData.skills} onChange={handleArrayChange} onAdd={() => addToArray('skills')} />
        <ArrayField label="Langues" field="languages" values={formData.languages} onChange={handleArrayChange} onAdd={() => addToArray('languages')} />

        {/* ✅ DISPONIBILITÉS UNIQUES AVEC AJOUT / SUPPRESSION */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">Disponibilités</label>
          {formData.availability.map((day, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <select
                value={day}
                onChange={(e) => {
                  const updated = [...formData.availability];
                  updated[index] = e.target.value;
                  setFormData(prev => ({ ...prev, availability: updated }));
                }}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Choisissez un jour</option>
                {DAYS_OF_WEEK.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  const updated = formData.availability.filter((_, i) => i !== index);
                  setFormData(prev => ({ ...prev, availability: updated }));
                }}
                className="text-red-600 text-xl font-bold hover:text-red-800"
                title="Supprimer"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            onClick={() => setFormData(prev => ({ ...prev, availability: [...prev.availability, ''] }))}
            className="text-sm text-blue-600 hover:underline"
          >
            ➕ Ajouter une disponibilité
          </button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-semibold transition"
          >
            💾 Sauvegarder les modifications
          </button>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </section>
  );
}

// Input avec ✏️ icône
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

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <textarea {...props} rows={4} className="w-full border border-gray-300 rounded-lg p-2 pr-10" />
        <span className="absolute top-2 right-3 text-gray-400">✏️</span>
      </div>
    </div>
  );
}

function ArrayField({ label, field, values, onChange, onAdd }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      {values.map((val, i) => (
        <div key={i} className="flex items-center border border-gray-300 rounded-lg p-2 mb-2">
          <input
            value={val}
            onChange={(e) => onChange(field, i, e.target.value)}
            className="w-full outline-none"
          />
          <span className="ml-2 text-gray-400">✏️</span>
        </div>
      ))}
      <button onClick={onAdd} className="text-sm text-blue-600 hover:underline">➕ Ajouter</button>
    </div>
  );
}
