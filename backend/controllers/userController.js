const User = require('../models/user');
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

// Contrôleur d'inscription
const register = async (req, res) => {
  const { name, email, password, role, gender, phone } = req.body;

  try {
    if (!name || !email || !password || !role || !gender) {
      return res.status(400).json({ message: "Tous les champs sont requis : name, email, password, role, gender." });
    }

    if (!['parent', 'babysitter'].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Le rôle doit être 'parent' ou 'babysitter'." });
    }

    if (!['Homme', 'Femme'].includes(gender)) {
      return res.status(400).json({ message: "Le genre doit être 'Homme' ou 'Femme'." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role.toLowerCase(),
      gender,
      phone
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn10Min = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = code;
    user.verificationCodeExpires = expiresIn10Min;
    await user.save();

    console.log("📩 Envoi de l'email en cours...");
    await sendEmail({
      email: user.email,
      subject: "Vérification de votre compte",
      message: `Votre code de vérification est : ${code}`
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

const completeProfile = async (req, res) => {
  const userId = req.user._id;
  


  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    if (user.profileCompleted) {
      return res.status(400).json({ message: "Profil déjà complété." });
    }

    const photoPath = req.file ? req.file.path : "";

    if (user.role === 'parent') {
      const profile = {
        photo: photoPath,
        location: req.body.location,
        numberOfChildren: parseInt(req.body.numberOfChildren, 10),
        budget: parseInt(req.body.budget, 10),
        availability: JSON.parse(req.body.availability || '[]'),
      };

      if (
        profile.numberOfChildren == null ||
        profile.budget == null ||
        !profile.location ||
        !Array.isArray(profile.availability)
      ) {
        return res.status(400).json({ message: "Tous les champs sont requis pour les parents." });
      }

      user.profile = profile;
    }

    if (user.role === 'babysitter') {
      const babysitterProfile = {
        photo: photoPath,
        location: req.body.location,
        skills: req.body.skills ? JSON.parse(req.body.skills) : [],
        experience: parseInt(req.body.experience, 10),
        availability: JSON.parse(req.body.availability || '[]'),
        hourlyRate: parseFloat(req.body.hourlyRate),
        description: req.body.description || '',
        maxChildren: parseInt(req.body.maxChildren, 10),
        educationLevel: req.body.educationLevel || '',
        languages: req.body.languages ? JSON.parse(req.body.languages) : [],
      };

      if (
        babysitterProfile.hourlyRate == null ||
        !babysitterProfile.location ||
        !Array.isArray(babysitterProfile.availability)
      ) {
        return res.status(400).json({ message: "Champs obligatoires manquants pour le babysitter." });
      }

      user.babysitterProfile = babysitterProfile;
    }

    user.profileCompleted = true;
    await user.save();

    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profile: user.profile,
      babysitterProfile: user.babysitterProfile,
      profileCompleted: user.profileCompleted,
    };

    res.status(200).json({ message: "Profil complété avec succès.", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email et code requis." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (user.verificationCode.toLowerCase() !== code.toLowerCase()) {
      return res.status(400).json({ message: "Code de vérification incorrect." });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: "Code expiré. Demandez un nouveau code." });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Compte vérifié avec succès.",
      token,
      user: { id: user._id, email: user.email, role: user.role, isVerified: user.isVerified },
    });
  } catch (err) {
    console.error("Erreur lors de la vérification :", err);
    res.status(500).json({ message: "Erreur lors de la vérification.", error: err.message });
  }
};

const updateBabysitterProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    if (user.role !== 'babysitter') {
      return res.status(403).json({ message: "Accès refusé : vous n'êtes pas baby-sitter." });
    }

    user.babysitterProfile = {
      ...user.babysitterProfile,
      ...updates
    };

    await user.save();

    res.status(200).json({ message: "Profil baby-sitter mis à jour avec succès.", babysitterProfile: user.babysitterProfile });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = newCode;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Nouveau code de vérification',
      text: `Voici votre nouveau code de vérification : ${newCode}. Il expire dans 15 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur envoi mail:', error);
        return res.status(500).json({ message: "Erreur lors de l'envoi du code par mail." });
      } else {
        console.log('Email envoyé:', info.response);
        res.status(200).json({ message: 'Nouveau code envoyé par email.' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

const getAllBabysitters = async (req, res) => {
  try {
    const babysitters = await User.find({ role: 'babysitter' }).populate('babysitterProfile');
    res.status(200).json(babysitters);
  } catch (error) {
    console.error('Erreur lors de la récupération des babysitters :', error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des babysitters." });
  }
};

const addFavoriteBabysitter = async (req, res) => {
  try {
    const userId = req.user.userId;
    const babysitterId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    if (!user.profile) user.profile = {};
    if (!Array.isArray(user.profile.favorites)) user.profile.favorites = [];

    if (!user.profile.favorites.includes(babysitterId)) {
      user.profile.favorites.push(babysitterId);
      user.markModified('profile');
      await user.save();
      console.log("Favoris mis à jour :", user.profile.favorites);
    }

    res.status(200).json({ success: true, favorites: user.profile.favorites });
  } catch (error) {
    console.error('Erreur lors de l’ajout aux favoris :', error);
    res.status(500).json({ message: 'Erreur serveur lors de l’ajout aux favoris.' });
  }
};

const getFavoriteBabysitters = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('profile.favorites');
    if (!user || !user.profile || !Array.isArray(user.profile.favorites)) {
      return res.status(404).json({ message: 'Utilisateur ou profil non trouvé.' });
    }

    res.status(200).json(user.profile.favorites);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des favoris.' });
  }
};

const removeFavoriteBabysitter = async (req, res) => {
  try {
    const userId = req.user.userId;
    const babysitterId = req.params.id;

    const user = await User.findById(userId);
    if (!user || !user.profile || !Array.isArray(user.profile.favorites)) {
      return res.status(404).json({ message: 'Utilisateur ou favoris non trouvés.' });
    }

    user.profile.favorites = user.profile.favorites.filter(
      (id) => id && id.toString() !== babysitterId
    );

    await user.save();

    res.status(200).json({ success: true, favorites: user.profile.favorites });
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du favori.' });
  }
};

module.exports = {
  register,
  completeProfile,
  verifyCode,
  updateBabysitterProfile,
  resendVerificationCode,
  getAllBabysitters,
  addFavoriteBabysitter,
  getFavoriteBabysitters,
  removeFavoriteBabysitter,
};
