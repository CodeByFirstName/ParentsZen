import React, { useState } from 'react';
import Header from '../components/header';
import Layout from '../components/layout';
import Card from '../components/card';
import Button from '../components/button';
import Modal from '../components/modal';
import SectionTitle from '../components/SectionTitle';
import Container from '../components/container';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    alert("Tu as cliqué sur le bouton !");
  };

  return (
    <>
      <Header logo="/images/logo_ParentsZen.png" />

       <main className="px-6 py-10 max-w-7xl mx-auto">
        {/* Utilisation du composant SectionTitle */}
        <SectionTitle subtitle="Accueil">
          Bienvenue sur ParentsZen
        </SectionTitle>
        <p className="text-lg mb-10">
          Ceci est la page d'accueil de notre application de mise en relation entre parents et baby-sitters.
        </p>

        {/* Exemple d'une Card */}
        <div className="flex justify-center">
          <Card
            photo="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80"
            nom="Amina Sow"
            experience="5 ans"
            tarif="20€/h"
            dispo="Disponible"
            description="Baby-sitter expérimentée avec une passion pour le développement de l’enfant. Sérieuse et ponctuelle."
            onActionClick={handleClick}
            actionLabel="Voir profil"
          />
        </div>

        {/* Bouton pour ouvrir le modal */}
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsModalOpen(true)}>
                Ouvrir le Modal
          </Button>

        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 className="text-xl font-bold mb-4">Bienvenue dans le Modal !</h3>
          <p className="text-gray-600">
            Ce composant peut être utilisé pour afficher un formulaire d'inscription, des détails de profil, etc.
          </p>
        </Modal>
        <Container>
         <h1>Test du Container</h1>
          <p>Voici un contenu à l’intérieur du Container.</p>
        </Container>
      </main>

      <Layout />
    </>
  );
};

export default Home;
