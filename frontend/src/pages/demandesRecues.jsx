import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/card';
import SectionTitle from '../components/SectionTitle';
import { font } from '../styles/designSystem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DemandesRecues() {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);

  // 🔄 Récupération des demandes reçues
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/babysitter/demandes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Erreur serveur: ${res.status}`);
        const data = await res.json();
        setDemandes(data);
      } catch (err) {
        console.error('Erreur récupération des demandes:', err.message);
        toast.error("⚠️ Impossible de charger les demandes");
      }
    };

    fetchDemandes();
  }, []);

  return (
    <section className="py-10 px-6 relative" style={{ fontFamily: font.family }}>
      {/* SVG décoratif haut */}
      <div className="absolute top-0 right-0 z-[-1]">
        <svg width="280" height="280" viewBox="0 0 300 300" fill="none">
          <path
            d="M300,0 C240,40 260,120 180,140 C100,160 60,100 0,180 L0,0 Z"
            fill="#D1FAE5"
          />
        </svg>
      </div>

      <SectionTitle
        title="Demandes reçues"
        subtitle="Consultez et gérez les demandes des parents"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {demandes.length > 0 ? (
          demandes.map((demande, index) => (
            <Card
              key={index}
              photo={demande.parent?.photo || '/default-avatar.png'}
              nom={demande.parent?.name || 'Parent inconnu'}
              experience={`Enfant: ${demande.childName || 'Non précisé'}`}
              tarif={`${demande.budget || 0} FCFA`}
              dispo={`Date: ${new Date(demande.date).toLocaleDateString()}`}
              description={demande.message || 'Aucun message.'}
              actionLabel="Voir la demande"
              onActionClick={() => navigate(`/babysitter/dashboard/demandes/${demande._id}`)}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            Vous n'avez reçu aucune demande pour le moment.
          </p>
        )}
      </div>

      {/* Vague décorative bas */}
      <div className="w-full mt-16 overflow-hidden">
        <svg className="w-full h-32 sm:h-48 md:h-64 lg:h-72" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            d="M0,160 C120,280 240,40 360,160 C480,280 600,40 720,160 C840,280 960,40 1080,160 C1200,280 1320,40 1440,160 L1440,320 L0,320 Z"
            fill="#D1FAE5"
          />
        </svg>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </section>
  );
}
