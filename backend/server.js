const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoute');
const searchRoutes = require('./routes/searchRoute');
const reviewRoutes = require('./routes/reviewsRoute');
const upload = require('./middleware/uploadMiddleware');
const uploadRoute = require('./routes/upload');

// Initialiser l'app Express
const app = express();

// Middlewares globaux
const allowedOrigins = [
  'http://localhost:5173',
  'https://parentszen.onrender.com/' // 👈 Tu changeras ça après déploiement
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('🎉 API Babysitting opérationnelle !');
});

app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/reviews', reviewRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté avec succès');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
  });
