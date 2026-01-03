import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../components/button';
import { LogOutIcon, MailIcon } from 'lucide-react';

export default function BabysitterDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/babysitters/me')
      .then(res => setData(res.data))
      .catch(err => console.error("Erreur chargement données babysitter:", err));
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background text-textDark">
      <p>Chargement...</p>
    </div>
  );

  return (
    <div className="bg-background min-h-screen p-6 font-sans text-textDark">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Bienvenue, {data.name}
        </h1>

        {/* DEMANDES DE GARDE */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">📬 Demandes de garde</h2>
          {data.requests.length === 0 ? (
            <p className="text-textLight">Aucune demande pour le moment.</p>
          ) : (
            <ul className="space-y-4">
              {data.requests.map((req) => (
                <li key={req.id} className="bg-white p-4 rounded-lg shadow-card">
                  <p><strong>De :</strong> {req.parentName}</p>
                  <p><strong>Objet :</strong> {req.messageSubject}</p>
                  <a
                    href={req.gmailLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-blue-600 underline"
                  >
                    <MailIcon className="w-4 h-4 mr-1" /> Ouvrir dans Gmail
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* AVIS REÇUS */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">⭐ Avis reçus</h2>
          {data.reviews.length === 0 ? (
            <p className="text-textLight">Vous n'avez pas encore d'avis.</p>
          ) : (
            <ul className="space-y-4">
              {data.reviews.map((rev) => (
                <li key={rev.id} className="bg-softBlue p-4 rounded-lg">
                  <p className="font-semibold">{rev.author}</p>
                  <p className="text-yellow-500">Note : {rev.rating}/5</p>
                  <p>{rev.text}</p>
                  <p className="text-sm text-textLight">{rev.date}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* DECONNEXION */}
        <div className="text-center">
          <Button variant="destructive">
            <LogOutIcon className="w-4 h-4 mr-2" /> Se déconnecter
          </Button>
        </div>
      </div>
    </div>
  );
}
