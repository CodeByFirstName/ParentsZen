// src/components/HomeSections.jsx
import React from 'react';
import SectionTitle from '../components/SectionTitle';
import Container from '../components/container';
import { colors, font } from '../styles/designSystem';

// Slider
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const features = [
  {
    title: "Des baby-sitters de confiance",
    description: "Tous les profils sont soigneusement vérifiés pour garantir la sécurité et le bien-être de vos enfants.",
    icon: "🍼"
  },
  {
    title: "Une recherche simple et rapide",
    description: "Trouvez facilement une baby-sitter disponible près de chez vous, en seulement quelques clics.",
    icon: "🔍"
  },
  {
    title: "Des avis authentiques",
    description: "Consultez les évaluations et commentaires d’autres parents pour choisir la baby-sitter qui vous convient.",
    icon: "⭐"
  }
];

const testimonials = [
  {
    name: "Marie D.",
    city: "Paris",
    comment: "Une expérience incroyable ! L'application a changé ma façon de travailler.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Karim B.",
    city: "Lyon",
    comment: "Design élégant, fonctionnalités utiles, que demander de plus ?",
    avatar: "https://randomuser.me/api/portraits/men/35.jpg"
  },
  {
    name: "Amina S.",
    city: "Marseille",
    comment: "J’ai trouvé une baby-sitter en 10 minutes. Service très efficace !",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Jean T.",
    city: "Toulouse",
    comment: "Je recommande à tous les parents ! Super application.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  }
];

const HomeSections = () => {
  return (
    <div style={{ fontFamily: font.family, backgroundColor: colors.background, color: colors.textDark }}>

      {/* Fonctionnalités clés */}
      <div className="py-16 px-4 md:px-12 lg:px-24">
        <SectionTitle>Fonctionnalités clés</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
          {features.map(({ title, description, icon }, i) => (
            <div 
              key={i} 
              className="
                bg-white 
                rounded-xl 
                p-6 
                shadow-md 
                text-center 
                transform transition-transform duration-300 hover:scale-105
                cursor-default
              "
              aria-label={title}
            >
              <div className="text-5xl mb-4" aria-hidden="true">{icon}</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.primary }}>{title}</h3>
              <p className="text-gray-700">{description}</p>
            </div>
          ))}
        </div>
      </div>

      
      
    </div>
  );
};

export default HomeSections;
