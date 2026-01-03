import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { colors } from '../styles/designSystem';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function BabysitterProfile() {
  const { id: babysitterId } = useParams();
  const { user, token } = useAuth();

  const [babysitter, setBabysitter] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [userReviewId, setUserReviewId] = useState(null);
  const reviewFormRef = useRef(null);

  useEffect(() => {
    fetchBabysitter();
    fetchReviews();
  }, [babysitterId]);

  const fetchBabysitter = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${babysitterId}`);
      setBabysitter(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/${babysitterId}`);
      setReviews(res.data);

      const existing = res.data.find((r) => r.parent && r.parent._id === user._id);
      if (existing) {
        setUserReviewId(existing._id);
        setNewReview({ rating: existing.rating, comment: existing.comment });
      } else {
        setUserReviewId(null);
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (userReviewId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/reviews/${userReviewId}`,
          newReview,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/reviews/${babysitterId}`,
          newReview,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/reviews/${userReviewId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserReviewId(null);
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  if (!babysitter) return <div className="p-6">Chargement...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profil principal */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
          {babysitter.name}
        </h1>
        <p className="text-gray-700 mb-1">{babysitter.babysitterProfile?.location}</p>
        <p className="text-gray-600 mt-4">{babysitter.babysitterProfile?.description}</p>
        <a
          href={`mailto:${babysitter.email}`}
          className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          ✉️ Contacter par email
        </a>
      </div>

      {/* Détails du profil */}
      {babysitter.babysitterProfile && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Détails du profil</h2>
          <div className="space-y-1 text-gray-700">
            <p><strong>Ville :</strong> {babysitter.babysitterProfile.location}</p>
            <p><strong>Nombre d'enfants max :</strong> {babysitter.babysitterProfile.maxChildren}</p>
            <p><strong>Tarif horaire :</strong> {babysitter.babysitterProfile.hourlyRate} €/h</p>
            <p><strong>Expérience :</strong> {babysitter.babysitterProfile.experience} an(s)</p>
            <p><strong>Niveau d'études :</strong> {babysitter.babysitterProfile.educationLevel || 'Non précisé'}</p>
            <p><strong>Langues parlées :</strong> {(babysitter.babysitterProfile.languages || []).join(', ') || 'Non spécifié'}</p>
            <p><strong>Compétences :</strong> {(babysitter.babysitterProfile.skills || []).join(', ')}</p>
            <p><strong>Disponibilité :</strong> {(babysitter.babysitterProfile.availability || []).length > 0 ? babysitter.babysitterProfile.availability.map((a, i) => (
              <span key={i}>{a.day} ({a.start} - {a.end}) </span>
            )) : 'Non renseignée'}</p>
          </div>
        </div>
      )}

      {/* Bloc des avis */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Avis des parents</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">Aucun avis pour le moment.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review._id} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">
                      {review.parent?.name ?? 'Parent anonyme'}
                    </span>
                    <span className="text-yellow-500 ml-2">{"⭐".repeat(review.rating)}</span>
                  </div>
                  {user && review.parent?._id === user._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setUserReviewId(review._id);
                          setNewReview({ rating: review.rating, comment: review.comment });
                          reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        title="Modifier"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={handleDeleteReview}
                        title="Supprimer"
                        className="text-red-500 hover:text-red-700"
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{review.comment || 'Aucun commentaire.'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulaire d'avis */}
      <div ref={reviewFormRef} className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {userReviewId ? 'Modifier votre avis' : 'Laisser un avis'}
        </h2>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (1 à 5)
            </label>
            <select
              name="rating"
              value={newReview.rating}
              onChange={handleReviewChange}
              className="w-20 border border-gray-300 rounded-md p-1"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleReviewChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Écrivez votre avis ici..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md"
            >
              {userReviewId ? 'Mettre à jour' : 'Envoyer'}
            </button>
            {userReviewId && (
              <button
                type="button"
                onClick={handleDeleteReview}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md"
              >
                Supprimer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
