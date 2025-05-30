import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle"; // pour le style
import Card from "../components/card"; // ou structure customisée
import axios from "axios";

export default function BabysitterProfilePage() {
  const { id } = useParams();
  const [babysitter, setBabysitter] = useState(null);

  useEffect(() => {
    axios.get(`/api/babysitters/${id}`)
      .then(res => setBabysitter(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!babysitter) return <p>Chargement...</p>;

  return (
    <div>
      <SectionTitle text={`Profil de ${babysitter.name}`} />

      <img src={babysitter.photo} alt="photo" />
      <h2>{babysitter.name}</h2>
      <p>Genre : {babysitter.gender}</p>
      <p>Ville : {babysitter.city}</p>
      <p>Expérience : {babysitter.experience} an(s)</p>
      <p>À propos : {babysitter.bio}</p>

      <h3>Détails professionnels</h3>
      <p>Tarif horaire : {babysitter.rate} FCFA</p>
      <p>Disponibilités : {babysitter.availability}</p>
      <p>Langues : {babysitter.languages.join(", ")}</p>
      <p>Spécialisations : {babysitter.skills.join(", ")}</p>

      <h3>Avis</h3>
      <p>Moyenne : {babysitter.rating || "Aucun avis"}</p>
      <ul>
        {babysitter.reviews?.map((review, i) => (
          <li key={i}>{review.comment} — ★ {review.stars}</li>
        ))}
      </ul>

      <button onClick={() => toggleFavorite(babysitter.id)}>
        ❤️ {isFavorite(babysitter.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
      </button>

      <a href={`mailto:${babysitter.email}`}>
        <button>Contacter par mail</button>
      </a>

      <button onClick={() => window.history.back()}>
        ← Retour
      </button>
    </div>
  );
}
