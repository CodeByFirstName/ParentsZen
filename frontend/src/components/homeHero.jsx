import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/button';
import Modal from '../components/modal'; // supposé que tu as ce composant
import { font } from '../styles/designSystem';

const images = [
  '/images/hero-baby.png',
  '/images/hero-baby2.jpg',
  '/images/hero-baby3.jpg',
];

const HomeHero = () => {
  const [index, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <section
      className="relative bg-orange-100 flex flex-col md:flex-row items-center justify-between p-6 md:p-16 overflow-hidden rounded-b-[70px]"
      style={{ fontFamily: font.family }}
    >
      {/* Texte animé */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-xl z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
          Trouve une baby-sitter de confiance <br className="hidden md:block" />
          en quelques clics
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Des profils vérifiés, notés et disponibles près de chez toi.
        </p>

        {/* Bouton pour ouvrir modal */}
        <Button onClick={openModal}>Trouver une baby-sitter</Button>

      </motion.div>

      {/* Slider images */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full md:w-1/2 mt-8 md:mt-0 z-10"
      >
        <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl shadow-xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[index]}
              src={images[index]}
              alt="Baby-sitter et enfant heureux"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modal inscription / connexion */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        {/* Ici tu mets ton composant ou contenu d'inscription / connexion */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: font.family }}>
            S’inscrire / Se connecter
          </h2>
          {/* Exemple : formulaire, ou boutons, ou ce que tu veux */}
          <p className="mb-4">Formulaire d'inscription et connexion ici...</p>
          <Button label="Fermer" onClick={closeModal} />
        </div>
      </Modal>
    </section>
  );
};

export default HomeHero;
