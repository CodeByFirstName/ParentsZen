import React, { useState, useEffect } from 'react';
import Card from '../components/card';
import SectionTitle from '../components/SectionTitle';
import { font } from '../styles/designSystem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FavoritesList() {
  const [babysitters, setBabysitters] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // 🔄 Récupération des babysitters et favoris au chargement
  useEffect(() => {
    const fetchBabysittersAndFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Utilisateur non authentifié');

        // Récupérer la liste complète des babysitters
        const res = await fetch('http://localhost:5000/api/users/babysitters', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Erreur serveur babysitters : ${res.status}`);
        const data = await res.json();

        // Récupérer la liste des favoris (ids)
        const favRes = await fetch('http://localhost:5000/api/users/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!favRes.ok) throw new Error(`Erreur serveur favoris : ${favRes.status}`);
        const favData = await favRes.json();
        const favIds = favData.map((b) => b._id);

        setBabysitters(data);
        setFavorites(favIds);
      } catch (err) {
        console.error('Erreur:', err.message);
        toast.error('Erreur lors du chargement des favoris.');
      }
    };

    fetchBabysittersAndFavorites();
  }, []);

  // 🔁 Toggle favoris (ajout/suppression)
  const toggleFavorite = async (babysitterId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vous devez être connecté(e) pour modifier les favoris.');
      return;
    }

    const isFav = favorites.includes(babysitterId);

    try {
      const url = `http://localhost:5000/api/users/favorites/${babysitterId}`;
      const options = {
        method: isFav ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await fetch(url, options);
      if (!res.ok) throw new Error('Erreur lors de la mise à jour des favoris');

      // Mise à jour locale (comme on affiche uniquement les favoris, on enlève direct de la liste)
      if (isFav) {
        setFavorites(favorites.filter((id) => id !== babysitterId));
        toast.info('❌ Retiré des favoris');
      } else {
        setFavorites([...favorites, babysitterId]);
        toast.success('💖 Ajouté aux favoris !');
      }
    } catch (err) {
      console.error('Erreur favoris:', err.message);
      toast.error("⚠️ Erreur lors de la mise à jour des favoris");
    }
  };

  // Préparation des données pour afficher seulement les babysitters favoris
  const favoriteBabysitters = babysitters
    .filter((b) => favorites.includes(b._id))
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
      isFavorite: true, // for favorites list, toujours true
    }));

  return (
    <section className="py-10 px-6 relative" style={{ fontFamily: font.family }}>
      <SectionTitle
        title="Voilà la liste de vos favoris"
        subtitle="Retrouvez ici vos babysitters préférés."
      />

      {favoriteBabysitters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {favoriteBabysitters.map((item, index) => (
            <Card
              key={item.id}
              photo={item.photo}
              nom={item.nom}
              experience={`Ville : ${item.ville}`}
              tarif={`${item.tarif} FCFA/heure`}
              dispo={item.dispo}
              description={item.description}
              babysitterId={item.id}
              initialIsFavorite={item.isFavorite}
              onActionClick={() => alert(`Profil de ${item.nom}`)}
              actionLabel="Voir profil"
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-8">
          Vous n'avez aucun favori pour le moment.
        </p>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </section>
  );
}
