const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Pour le hachage des mots de passe

// Schéma pour un utilisateur
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Email doit être unique
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Validation : mot de passe minimum 6 caractères
  },
  role: {
    type: String,
    enum: ['admin','parent', 'babysitter'],
    default: 'parent' // Rôle par défaut
  },

   gender: {
    type: String,
    enum: ['Homme', 'Femme'],
    required: true
  },

  phone: {
     type: String, 
     required: false 
    },
  // Champ supplémentaire pour compléter le profil
  profileCompleted: {
    type: Boolean,
    default: false // On met false, tant que le profil n'est pas complété
  },
  verificationCode: {
  type: String,
},
verificationCodeExpires: { 
  type: Date 
},
 
  isVerified: {
    type: Boolean,
    default: false
  },

  // Complément de profil pour le parent
  profile: {
    photo: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: '',
    },
    numberOfChildren: {
      type: Number,
      default: null
    },
    budget: {
      type: Number,
      default: null
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    availability: [
      {
        day: String, // Lundi, Mardi, etc.
        startTime: String, // Heure de début
        endTime: String, // Heure de fin
      }
    ],
  },
  // Complément de profil pour le babysitter
  babysitterProfile: {
    photo: {
      type: String,           // Le type des données (ici, une URL ou un chemin de fichier, donc une chaîne de caractères)
      default: '',            // Valeur par défaut si aucune photo n’est fournie
    },
    
    location: {
      type: String,
      default: '',
    },
    skills: {
      type: [String], // Liste des compétences
      default: [],
    },
    experience: {
      type: Number, // Années d'expérience
      default: 0
    },
    availability: [
      {
        day: String,  // Lundi, Mardi, etc.
        startTime: String, // Heure de début
        endTime: String, // Heure de fin
      }
    ],
    hourlyRate: {
      type: Number,  // Tarif horaire du babysitter
      default: null
    },

     // Nouveaux champs
  description: { type: String, default: '' },      // Pourquoi elle fait ce métier
  maxChildren: { type: Number, default: 1 },       // Nombre max d’enfants gardés
  educationLevel: { type: String, default: '' },   // Niveau d’études
  languages: { type: [String], default: [] },      // Langues parlées

  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Liste des utilisateurs qui l'ont en favoris (optionnel)

  },
});

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Si le mot de passe n'est pas modifié, pas besoin de hacher

  try {
    const salt = await bcrypt.genSalt(10); // Génère un "sel" (salt) pour hacher
    this.password = await bcrypt.hash(this.password, salt); // Hache le mot de passe
    next();
  } catch (error) {
    next(error); // Si une erreur survient, on passe à la suivante
  }
});

// Méthode pour comparer le mot de passe entré avec celui de la base
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare les mots de passe
};

// Création du modèle
const User = mongoose.model('User', userSchema);

module.exports = User;
