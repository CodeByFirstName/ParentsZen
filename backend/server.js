const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoute');
const searchRoutes = require('./routes/searchRoute');
const reviewRoutes = require('./routes/reviewsRoute');

// Initialiser l'app Express
const app = express();


// Middlewares globaux
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json()); // Pour parser le JSON

// Route de test
app.get('/', (req, res) => {
  res.send('🎉 API Babysitting opérationnelle !');
});

app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/reviews', reviewRoutes);


// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connecté avec succès');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Serveur lancé sur le port ${process.env.PORT || 5000}`);
  });
})
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB :', err.message);
});

