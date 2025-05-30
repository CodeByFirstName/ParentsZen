// routes/searchRoutes.js

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route pour que les parents recherchent des babysitters
// Exemple : /api/search/babysitters?location=Cotonou&budget=10&day=Samedi&startTime=08:00&endTime=18:00&skills=repas,langue&minExperience=2
router.get('/babysitters', verifyToken, searchController.searchBabysitters);

// Route pour que les babysitters recherchent des parents
// Exemple : /api/search/parents?location=Cotonou&maxChildren=2&day=Samedi&startTime=08:00&endTime=18:00&minAge=1&maxAge=6&specialNeeds=handicap,bébé
router.get('/parents', verifyToken, searchController.searchParents);

module.exports = router;
