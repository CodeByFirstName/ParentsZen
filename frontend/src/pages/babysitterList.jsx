import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Card from '../components/card';
import SectionTitle from '../components/SectionTitle';
import FilterPanel from '../components/filtersPanel';
import { font } from '../styles/designSystem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BabysitterList() {
    const navigate = useNavigate(); 
  const [search, setSearch] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    budget: '',
    day: '',
    gender: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [babysitters, setBabysitters] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 🔄 Récupération des babysitters + favoris
  useEffect(() => {
    const fetchBabysitters = async () => {
      try {
        const token = localStorage.getItem('token');
          
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/babysitters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
        const data = await res.json();
        setBabysitters(data);

        const favRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!favRes.ok) throw new Error(`Erreur serveur: ${favRes.status}`);
        const favData = await favRes.json();
        console.log('Favoris récupérés:', favData);

        const favIds = favData.map((b) => b._id);
        setFavorites(favIds);
      } catch (err) {
        console.error('Erreur:', err.message);
      }
    };

    fetchBabysitters();
  }, []);

// 🔁 Gérer l'ajout ou suppression de favoris
const toggleFavorite = async (babysitterId) => {
  const token = localStorage.getItem('token');
  const isFav = favorites.includes(babysitterId);

  try {
    const url = `${import.meta.env.VITE_API_URL}/api/users/favorites/${babysitterId}`;
    console.log("URL appelée:", url); // 👈 ajoute ça
    const options = {
      method: isFav ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error('Erreur lors de la mise à jour des favoris');

    // Mise à jour locale + TOAST
    if (isFav) {
      setFavorites(favorites.filter((id) => id !== babysitterId));
      toast.info('❌ Retiré des favoris');
    } else {
      setFavorites([...favorites, babysitterId]);
      toast.success('💖 Ajouté aux favoris !');
    }
  } catch (err) {
    toast.error("⚠️ Erreur lors de la mise à jour des favoris");
    console.error('Erreur favoris:', err.message);
  }
};


  // 🧠 Filtres
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSearch(newFilters.location);
    setMaxBudget(newFilters.budget);
  };

  const filteredData = babysitters
    .map((b) => ({
      id: b._id,
      photo: b.babysitterProfile?.photo || b.profile?.photo || '/default-avatar.png',
      nom: b.name || 'Nom inconnu',
      ville: b.babysitterProfile?.location || 'Ville non précisée',
      tarif: b.babysitterProfile?.hourlyRate || 0,
      dispo:
        b.babysitterProfile?.availability?.map(
          (a) => `${a.day}: ${a.startTime} - ${a.endTime}`
        ).join(', ') || 'Disponibilité non précisée',
      description: b.babysitterProfile?.description || 'Aucune description pour le moment.',
      dayList: b.babysitterProfile?.availability?.map((a) => a.day) || [],
      gender: b.gender || '',
      isFavorite: favorites.includes(b._id),
    }))
    .filter((b) => {
      const matchesLocation = b.ville.toLowerCase().includes(filters.location.toLowerCase());
      const matchesBudget = filters.budget ? b.tarif <= Number(filters.budget) : true;
      const matchesDay = filters.day ? b.dayList.includes(filters.day) : true;
      const matchesGender = filters.gender ? b.gender === filters.gender : true;
      return matchesLocation && matchesBudget && matchesDay && matchesGender;
    });

  return (
    <section className="py-10 px-6 relative" style={{ fontFamily: font.family }}>
      {/* SVG décoratif */}
      <div className="absolute top-0 right-0 z-[-1]">
        <svg width="280" height="280" viewBox="0 0 300 300" fill="none">
          <path
            d="M300,0 C240,40 260,120 180,140 C100,160 60,100 0,180 L0,0 Z"
            fill="#D1FAE5"
          />
        </svg>
      </div>

      <SectionTitle title="Nos baby-sitters disponibles" subtitle="Des profils de confiance près de chez vous." />

      {!showFilters && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowFilters(true)}
            className="px-6 py-3 rounded-2xl text-green-900 font-semibold text-lg bg-[#D1FAE5] hover:bg-[#A7F3D0] transition"
          >
            🔍 Rechercher une baby-sitter
          </button>
        </div>
      )}

      {showFilters && (
        <div className="mb-6">
          <FilterPanel onFilterChange={handleFilterChange} />
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowFilters(false)}
              className="px-6 py-3 rounded-2xl text-green-900 font-semibold text-lg bg-[#D1FAE5] hover:bg-[#A7F3D0] transition"
            >
              ❌ Fermer les filtres
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <Card
              key={index}
    photo={item.photo}
    nom={item.nom}
    experience={`Ville : ${item.ville}`}
    tarif={`${item.tarif} FCFA/heure`}
    dispo={item.dispo}
    description={item.description}
    babysitterId={item.id}
    initialIsFavorite={item.isFavorite}
    onActionClick={() => navigate(`/parent/dashboard/babysitters/${item.id}`)}

    actionLabel="Voir profil"
    onToggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            Aucune baby-sitter ne correspond aux critères.
          </p>
        )}
      </div>

      {/* Vague décorative bas */}
      <div className="w-full mt-16 overflow-hidden">
        <svg className="w-full h-32 sm:h-48 md:h-64 lg:h-72" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            d="M0,160 C120,280 240,40 360,160 C480,280 600,40 720,160 C840,280 960,40 1080,160 C1200,280 1320,40 1440,160 L1440,320 L0,320 Z"
            fill="#D1FAE5"
          />
        </svg>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />

    </section>
  );
}
