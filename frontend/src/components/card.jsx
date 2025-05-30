import React, { useState, useEffect } from 'react';
import { colors, font } from '../styles/designSystem';
import { useNavigate } from 'react-router-dom';

const Card = ({
  photo,
  nom,
  tarif,
  dispo,
  description,
  experience,
  babysitterId,
  initialIsFavorite = false,
  onActionClick,
  actionLabel = "Voir profil",
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [animateHeart, setAnimateHeart] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev); // MAJ instantanée
    setAnimateHeart(true); // Lance l'animation
    onToggleFavorite?.(babysitterId); // Appelle la fonction parent
  };

  // Fin de l’animation après 300ms
  useEffect(() => {
    if (animateHeart) {
      const timeout = setTimeout(() => setAnimateHeart(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [animateHeart]);
  const handleViewProfile = () => {
    navigate(`/parent/dashboard/babysitters/${babysitterId}`);
  };


  return (
    <div
      style={{ fontFamily: font.family }}
      className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* Bouton cœur favori */}
      <button
        onClick={handleToggle}
        className={`absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md transition-transform duration-300 ${
          animateHeart ? 'scale-125' : 'hover:scale-110'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transition-all duration-300 ease-in-out`}
          fill={isFavorite ? "#F97316" : "none"}
          stroke={isFavorite ? "#F97316" : "currentColor"}
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </button>

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={photo}
          alt={nom}
          className="w-full h-56 object-cover rounded-t-xl transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>

      {/* Contenu */}
      <div className="p-6 text-gray-800 text-[0.9rem] space-y-4">
        <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
          {nom}
        </h3>
        <p><strong>Ville :</strong> {experience?.replace('Ville : ', '')}</p>
        <p><strong>Tarif :</strong> {tarif}</p>
        <p><strong>Disponibilité :</strong> {dispo}</p>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="pt-4">
          <button
            onClick={onActionClick || handleViewProfile}
            className="bg-gradient-to-r from-orange-200 to-orange-400 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:from-orange-300 hover:to-orange-500 transition duration-300 w-full text-sm"
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
