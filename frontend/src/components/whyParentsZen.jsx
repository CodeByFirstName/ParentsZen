import React from 'react';
import Card from '../components/card';
import { font } from '../styles/designSystem';

const data = [
  {
    photo: '/images/sophie.jpg',
    nom: 'Sophie D.',
    ville: 'Cotonou',
    tarif: '3000 FCFA/heure',
    dispo: 'Week-ends et soirs',
    description: 'Disponible, douce et expérimentée, Sophie adore travailler avec les enfants.',
  },
  {
    photo: '/images/fatou.jpg',
    nom: 'Fatou A.',
    ville: 'Calavi',
    tarif: '2500 FCFA/heure',
    dispo: 'Tous les jours après 17h',
    description: 'Étudiante en psychologie, Fatou sait comment créer un environnement rassurant.',
  },
  {
    photo: '/images/nadia.jpg',
    nom: 'Nadia K.',
    ville: 'Porto-Novo',
    tarif: '2000 FCFA/heure',
    dispo: 'Mercredis et samedis',
    description: 'Sérieuse et ponctuelle, Nadia a 3 ans d’expérience en garde d’enfants à domicile.',
  },
];

const AvailableBabysitters = () => {
  return (
    <section className="py-20 bg-white" style={{ fontFamily: font.family }}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-4 text-orange-600">
          Nos baby-sitters disponibles
        </h2>
        <p className="text-gray-600 mb-12">
          Des profils de confiance près de chez vous.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map((item, index) => (
            <Card
              key={index}
              photo={item.photo}
              nom={item.nom}
              experience={`Ville : ${item.ville}`}
              tarif={item.tarif}
              dispo={item.dispo}
              description={item.description}
              onActionClick={() => alert(`Profil de ${item.nom}`)}
              actionLabel="Voir profil"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailableBabysitters;
