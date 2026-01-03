const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Remplacer protect par verifyToken dans l'import
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  register,
  completeProfile,
  verifyCode,
  resendVerificationCode,
  getAllBabysitters,
  addFavoriteBabysitter,
  getFavoriteBabysitters,
  removeFavoriteBabysitter,
} = require('../controllers/userController');

// ===========================
// ✅ Authentification
// ===========================

// Créer un nouvel utilisateur
router.post('/register', register);

// Vérification du code
router.post('/verify-code', verifyCode);

// Renvoie du code
router.post('/resend-code', resendVerificationCode);

// Connexion utilisateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "L'utilisateur n'existe pas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileCompleted: user.profileCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ===========================
// ✅ Gestion du profil connecté
// ===========================

// Compléter le profil après inscription
router.put('/complete-profile', verifyToken, upload.single('photo'), completeProfile);

// Voir son profil
router.get('/me', verifyToken, async (req, res) => {
  //console.log("req.user =", req.user);
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour son propre profil
router.put('/me', verifyToken, async (req, res) => {
  try {
    const {
      name, location, numberOfChildren,
      skills, experience, availability,
      hourlyRate, description, maxChildren,
      educationLevel, languages
    } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.name = name || user.name;

    if (user.role === 'parent') {
      user.profile.location = location || user.profile.location;
      user.profile.numberOfChildren = numberOfChildren ?? user.profile.numberOfChildren;
      user.profile.availability = availability || user.profile.availability;
    } else if (user.role === 'babysitter') {
      user.babysitterProfile.location = location || user.babysitterProfile.location;
      user.babysitterProfile.skills = skills || user.babysitterProfile.skills;
      user.babysitterProfile.experience = experience ?? user.babysitterProfile.experience;
      user.babysitterProfile.availability = availability || user.babysitterProfile.availability;
      user.babysitterProfile.hourlyRate = hourlyRate ?? user.babysitterProfile.hourlyRate;
      user.babysitterProfile.description = description || user.babysitterProfile.description;
      user.babysitterProfile.maxChildren = maxChildren ?? user.babysitterProfile.maxChildren;
      user.babysitterProfile.educationLevel = educationLevel || user.babysitterProfile.educationLevel;
      user.babysitterProfile.languages = languages || user.babysitterProfile.languages;
    }

    await user.save();
    res.status(200).json({ message: 'Profil mis à jour avec succès', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// ===========================
// ✅ Admin : gestion des utilisateurs
// ===========================

// Récupérer tous les utilisateurs
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Récupérer tous les babysitters
router.get('/babysitters', verifyToken, getAllBabysitters);

// Modifier un utilisateur (admin)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      name, email, role, location,
      numberOfChildren, availability,
      hourlyRate, experience, skills
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.name = name || user.name;
    user.role = role || user.role;
    user.profile.location = location || user.profile.location;
    user.profile.numberOfChildren = numberOfChildren || user.profile.numberOfChildren;
    user.profile.availability = availability || user.profile.availability;

    if (user.role === 'babysitter') {
      user.babysitterProfile.skills = skills || user.babysitterProfile.skills;
      user.babysitterProfile.experience = experience || user.babysitterProfile.experience;
      user.babysitterProfile.availability = availability || user.babysitterProfile.availability;
      user.babysitterProfile.hourlyRate = hourlyRate || user.babysitterProfile.hourlyRate;
    }

    await user.save();
    res.status(200).json({ message: 'Utilisateur mis à jour', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un utilisateur (admin)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ❤️ Favoris
router.post('/favorites/:id', verifyToken, addFavoriteBabysitter);
router.get('/favorites', verifyToken, getFavoriteBabysitters);
router.delete('/favorites/:id', verifyToken, removeFavoriteBabysitter); 

// ===========================
// ✅ Public : Récupérer un utilisateur par ID
// ===========================
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
