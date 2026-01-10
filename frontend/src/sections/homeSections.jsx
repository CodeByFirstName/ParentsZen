// src/components/HomeSections.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import { colors, font } from '../styles/designSystem';
import { Shield, Search, Star } from 'lucide-react';

const features = [
  {
    title: "Des baby-sitters de confiance",
    description: "Tous les profils sont soigneusement vérifiés pour garantir la sécurité et le bien-être de vos enfants.",
    Icon: Shield,
    color: "#fb923c"
  },
  {
    title: "Une recherche simple et rapide",
    description: "Trouvez facilement une baby-sitter disponible près de chez vous, en seulement quelques clics.",
    Icon: Search,
    color: "#fb923c"
  },
  {
    title: "Des avis authentiques",
    description: "Consultez les évaluations et commentaires d'autres parents pour choisir la baby-sitter qui vous convient.",
    Icon: Star,
    color: "#fb923c"
  }
];

const HomeSections = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setTimeout(() => {
              setVisibleCards((prev) => [...new Set([...prev, index])]);
            }, index * 200);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // Définir les variants d'animation selon l'index
  const getVariants = (index) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // Mobile : gauche, droite, gauche
    const mobileX = index === 1 ? 100 : -100;
    
    // Desktop : gauche, bas, droite
    let desktopX = 0;
    let desktopY = 0;
    
    if (index === 0) desktopX = -100;
    else if (index === 1) desktopY = 100;
    else if (index === 2) desktopX = 100;

    return {
      hidden: {
        opacity: 0,
        x: isMobile ? mobileX : desktopX,
        y: isMobile ? 0 : desktopY
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 1,
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 0.8 }
        }
      }
    };
  };

  return (
    <div style={{ fontFamily: font.family, backgroundColor: colors.background, color: colors.textDark }}>

      {/* Fonctionnalités clés */}
      <div className="py-16 px-4 md:px-12 lg:px-24">
        <SectionTitle>Fonctionnalités clés</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {features.map(({ title, description, Icon, color }, i) => (
            <motion.div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              data-index={i}
              variants={getVariants(i)}
              initial="hidden"
              animate={visibleCards.includes(i) ? "visible" : "hidden"}
              className="
                bg-white 
                rounded-2xl 
                p-8 
                shadow-lg
                hover:shadow-xl
                text-center 
                transition-shadow duration-300
                cursor-default
                border border-gray-100
              "
              aria-label={title}
            >
              {/* Icône animée */}
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon 
                  size={32} 
                  strokeWidth={2}
                  style={{ color: color }}
                />
              </div>

              <h3 className="text-xl font-semibold mb-3" style={{ color: colors.primary }}>
                {title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSections;