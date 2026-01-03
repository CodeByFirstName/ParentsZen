import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function BabysitterReviews() {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des avis :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 text-orange-500">
          Avis reçus
        </h1>

        {loading ? (
          <p className="text-gray-500">Chargement des avis...</p>
        ) : reviews.length === 0 ? (
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
                    <span className="text-yellow-500 ml-2">
                      {'⭐'.repeat(review.rating)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">
                  {review.comment || 'Aucun commentaire.'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
