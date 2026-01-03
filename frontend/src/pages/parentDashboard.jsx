import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../components/button';
import Card from '../components/card';
import { Input } from '../components/input';
import Modal from '../components/modal';
import { StarIcon, HeartIcon, MessageSquareIcon, TrashIcon } from 'lucide-react';

export default function ParentDashboard() {
  const [babysitters, setBabysitters] = useState([]);
  const [filteredBabysitters, setFilteredBabysitters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [reviewModal, setReviewModal] = useState(null);
  const [contactModal, setContactModal] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  // Chargement initial des babysitters
  useEffect(() => {
    axios.get('/api/babysitters')
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setBabysitters(list);
        setFilteredBabysitters(list);
      })
      .catch((err) => console.error('Erreur chargement babysitters', err));
  }, []);

  
  // Application des filtres
  useEffect(() => {
    let result = babysitters;
    if (search) {
      result = result.filter((b) =>
        b.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (priorityOnly) {
      result = result.filter((b) => b.priority === 'haute');
    }
    setFilteredBabysitters(result);
  }, [search, priorityOnly, babysitters]);

  const handleAddToFavorites = (id) => {
    axios.post('/api/parents/favorites', { babysitterId: id })
      .then(() => {
        const added = babysitters.find((b) => b.id === id);
        setFavorites((prev) => {
          if (prev.some((b) => b.id === added.id)) return prev;
          return [...prev, added];
        });
      })
      .catch((err) => console.error("Erreur ajout favoris :", err));
  };

  const handleSubmitReview = () => {
    axios.post('/api/reviews', {
      babysitterId: reviewModal?.id,
      rating: Number(rating),
      text: reviewText,
    })
      .then(() => {
        setReviewModal(null);
        setReviewText('');
        setRating(5);
      })
      .catch((err) => console.error("Erreur envoi avis :", err));
  };

  return (
    <div className="bg-background min-h-screen p-6 font-sans text-textDark">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Bienvenue sur votre tableau de bord
        </h1>

        {!showFilters && (
          <button
            onClick={() => {
              setShowFilters(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-orange-600 font-medium underline hover:text-orange-800 mb-6"
          >
            🔍 Rechercher une baby-sitter
          </button>
        )}

        {showFilters && (
          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <Input
              placeholder="Rechercher une baby-sitter par nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
              aria-label="Recherche par nom"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={priorityOnly}
                onChange={(e) => setPriorityOnly(e.target.checked)}
                aria-label="Filtrer priorité haute"
              />
              Priorité haute
            </label>

            <div className="flex gap-4 mt-2 md:col-span-3">
              <Button type="submit">Rechercher</Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setSearch('');
                  setPriorityOnly(false);
                  setShowFilters(false);
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </form>
        )}

        {/* Babysitter List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBabysitters.map((b) => (
            <Card key={b.id} className="bg-white shadow-card rounded-2xl p-4 transition hover:ring-2 hover:ring-primary">
              <div className="flex items-center gap-4">
                <img
                  src={b.photo || '/default-avatar.png'}
                  alt={`Photo de ${b.name}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{b.name}</h2>
                  <p className="text-sm text-textLight">
                    {b.city} • {b.experience} ans
                  </p>
                  {typeof b.averageRating === 'number' && (
                    <p className="text-sm text-yellow-500">
                      ⭐ {b.averageRating.toFixed(1)} ({b.reviewCount ?? 0} avis)
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  onClick={() => handleAddToFavorites(b.id)}
                  variant="outline"
                  aria-label={`Ajouter ${b.name} aux favoris`}
                >
                  <HeartIcon className="w-4 h-4 mr-2" /> Favoris
                </Button>
                <Button
                  onClick={() => setContactModal(b)}
                  variant="ghost"
                  aria-label={`Contacter ${b.name}`}
                >
                  <MessageSquareIcon className="w-4 h-4 mr-2" /> Contacter
                </Button>
                <Button
                  onClick={() => setReviewModal(b)}
                  aria-label={`Laisser un avis pour ${b.name}`}
                >
                  <StarIcon className="w-4 h-4 mr-2" /> Avis
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {favorites.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Mes favoris</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favorites.map((f) => (
                <Card key={f.id} className="bg-softBlue p-4 rounded-xl">
                  <p className="font-semibold">{f.name}</p>
                  <p className="text-sm text-textLight">{f.city}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-bold mb-2">Mon profil</h2>
          <Button variant="outline" className="mr-4">Modifier mes infos</Button>
          <Button variant="destructive">
            <TrashIcon className="w-4 h-4 mr-2" /> Supprimer mon compte
          </Button>
        </div>
      </div>

      {/* MODALS */}
      {reviewModal && (
        <Modal onClose={() => setReviewModal(null)}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Laisser un avis pour {reviewModal.name}
            </h2>
            <label className="block text-sm text-textLight mb-1">Note</label>
            <Input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
            <label className="block text-sm text-textLight mt-4 mb-1">
              Votre avis
            </label>
            <textarea
              className="w-full border rounded p-2"
              rows="4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <Button onClick={handleSubmitReview} className="mt-4">Envoyer</Button>
          </div>
        </Modal>
      )}
      {contactModal && (
        <Modal onClose={() => setContactModal(null)}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Contacter {contactModal.name}</h2>
            <p>Email : {contactModal.email}</p>
            <p>Téléphone : {contactModal.phone || 'Non renseigné'}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
