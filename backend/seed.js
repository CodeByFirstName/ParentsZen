const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const defaultImage = "https://res.cloudinary.com/dimcjxxfh/image/upload/v1748389913/default.jpg";
const User = require('./models/user');

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connexion réussie à MongoDB');
  seedUsers(); // Appelle la fonction pour insérer les utilisateurs
})
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB :', err);
});

async function seedUsers() {
  try {
    await User.deleteMany(); // Vide la collection pour éviter les doublons

    const hashPassword = async (plainPassword) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(plainPassword, salt);
    };

    const users = [
      {
        name: "Amina",
        email: "amina@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Cotonou",
          hourlyRate: 3000,
          skills: ["repas", "soins", "lecture"],
          experience: "3",
          photo: defaultImage,
          availability: [
            { day: "Samedi", startTime: "08:00", endTime: "18:00" }
          ]
        }
      },
      {
        name: "Fatou",
        email: "fatou@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Porto-Novo",
          hourlyRate: 2500,
          skills: ["langue", "lecture", "jeux"],
          experience: "2",
          photo: defaultImage,
          availability: [
            { day: "Dimanche", startTime: "09:00", endTime: "17:00" }
          ]
        }
      },
      {
        name: "Nadine",
        email: "nadine@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Cotonou",
          hourlyRate: 3200,
          skills: ["soins", "jeux", "lecture"],
          experience: "4",
          photo: defaultImage,
          availability: [
            { day: "Samedi", startTime: "10:00", endTime: "19:00" }
          ]
        }
      },
      {
        name: "Chantal",
        email: "chantal@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Porto-Novo",
          hourlyRate: 1900,
          skills: ["jeux", "lecture", "langue"],
          experience: "1",
          photo: defaultImage,
          availability: [
            { day: "Vendredi", startTime: "14:00", endTime: "20:00" }
          ]
        }
      },
      {
        name: "Mariam",
        email: "mariam@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Cotonou",
          hourlyRate: 2400,
          skills: ["langue", "jeux", "soins"],
          experience: "2",
          photo: defaultImage,
          availability: [
            { day: "Mercredi", startTime: "07:00", endTime: "12:00" }
          ]
        }
      },
      {
        name: "Brigitte",
        email: "brigitte@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Porto-Novo",
          hourlyRate: 2300,
          skills: ["repas", "activités créatives", "jeux"],
          experience: "3",
          photo: defaultImage,
          availability: [
            { day: "Samedi", startTime: "08:00", endTime: "16:00" }
          ]
        }
      },
      {
        name: "Sophie",
        email: "sophie@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Cotonou",
          hourlyRate: 1700,
          skills: ["soins", "jeux", "langue"],
          experience: "1",
          photo: defaultImage,
          availability: [
            { day: "Dimanche", startTime: "10:00", endTime: "18:00" }
          ]
        }
      },
      {
        name: "Lucie",
        email: "lucie@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Bohicon",
          hourlyRate: 2600,
          skills: ["repas", "jeux", "lecture"],
          experience: "2",
          photo: defaultImage,
          availability: [
            { day: "Samedi", startTime: "08:00", endTime: "18:00" }
          ]
        }
      },
      {
        name: "Clémence",
        email: "clemence@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Cotonou",
          hourlyRate: 1800,
          skills: ["jeux", "lecture", "activités créatives"],
          experience: "1",
          photo: defaultImage,
          availability: [
            { day: "Lundi", startTime: "13:00", endTime: "18:00" }
          ]
        }
      },
      {
        name: "Estelle",
        email: "estelle@example.com",
        password: await hashPassword("password123"),
        role: "babysitter",
        gender: "Femme",
        babysitterProfile: {
          location: "Porto-Novo",
          hourlyRate: 2300,
          skills: ["repas", "langue", "lecture"],
          experience: "3",
          photo: defaultImage,
          availability: [
            { day: "Samedi", startTime: "09:00", endTime: "17:00" }
          ]
        }
      },
      {
        name: "Jean",
        email: "jean@example.com",
        password: await hashPassword("password123"),
        role: "parent",
        gender: "Homme",
        profile: {
          location: "Cotonou",
          numberOfChildren: 2,
          budget: 3247,
          photo: defaultImage,
          availability: [
            { day: "Samedi", startTime: "08:00", endTime: "18:00" }
          ],
          specialNeeds: ["autisme"],
          childrenAgeRange: [3, 6]
        }
      },
      {
        name: "Michel",
        email: "michel@example.com",
        password: await hashPassword("password123"),
        role: "parent",
        gender: "Homme",
        profile: {
          location: "Porto-Novo",
          numberOfChildren: 2,
          budget: 2714,
          photo: defaultImage,
          availability: [
            { day: "Samedi", startTime: "08:00", endTime: "18:00" }
          ],
          specialNeeds: [],
          childrenAgeRange: [2, 5]
        }
      },
      {
        name: "Sandra",
        email: "sandra@example.com",
        password: await hashPassword("password123"),
        role: "parent",
        gender: "Femme",
        profile: {
          location: "Cotonou",
          numberOfChildren: 1,
          budget: 2497,
          photo: defaultImage,
          availability: [
            { day: "Dimanche", startTime: "09:00", endTime: "17:00" }
          ],
          specialNeeds: ["autisme", "handicap"],
          childrenAgeRange: [1, 4]
        }
      },
      {
        name: "Diane",
        email: "diane@example.com",
        password: await hashPassword("password123"),
        role: "parent",
        gender: "Femme",
        profile: {
          location: "Parakou",
          numberOfChildren: 3,
          budget: 2807,
          photo: defaultImage,
          availability: [
            { day: "Mercredi", startTime: "07:00", endTime: "13:00" }
          ],
          specialNeeds: [],
          childrenAgeRange: [2, 9]
        }
      },
      {
        name: "Roland",
        email: "roland@example.com",
        password: await hashPassword("password123"),
        role: "parent",
        gender: "Homme",
        profile: {
          location: "Cotonou",
          numberOfChildren: 2,
          budget: 2154,
          photo: defaultImage,
          availability: [
            { day: "Vendredi", startTime: "14:00", endTime: "20:00" }
          ],
          specialNeeds: [],
          childrenAgeRange: [5, 8]
        }
      },
      {
        name: "Prisca",
        email: "prisca@example.com",
        password: await hashPassword("password123"),
        role: "parent",
        gender: "Femme",
        profile: {
          location: "Porto-Novo",
          numberOfChildren: 3,
          budget: 2534,
          photo: defaultImage,
          availability: [
            { day: "Lundi", startTime: "09:00", endTime: "15:00" }
          ],
          specialNeeds: ["autisme"],
          childrenAgeRange: [4, 10]
        }
      },
      {
        name: "Jules",
        email: "jules@example.com",
        password: await hashPassword("password123"),
        role: "parent",
        gender: "Homme",
        profile: {
          location: "Porto-Novo",
          numberOfChildren: 3,
          budget: 3126,
          photo: defaultImage,
          availability: [
            { day: "Samedi", startTime: "08:00", endTime: "16:00" }
          ],
          specialNeeds: [],
          childrenAgeRange: [3, 9]
        }
      }
    ];

    await User.insertMany(users);
    console.log('✅ Données insérées avec succès');
    process.exit();
  } catch (error) {
    console.error('❌ Erreur lors de l’insertion des données :', error);
    process.exit(1);
  }
}
