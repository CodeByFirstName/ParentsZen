const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createReview, getReviewsByBabysitter, getAverageRating , updateReview, deleteReview } = require('../controllers/reviewsController');
// Route pour récupérer la note moyenne
router.get('/average/:babysitterId', getAverageRating);

// Route pour récupérer tous les avis d’un baby-sitter (GET)
router.get('/:babysitterId', getReviewsByBabysitter);


// Route pour créer un avis (POST)
router.post('/:babysitterId', verifyToken, createReview);


// ✅ Route pour modifier un avis
router.put('/:reviewId', verifyToken, updateReview);

// Route pour supprimer un avis (DELETE)
router.delete('/:reviewId', verifyToken, deleteReview);

module.exports = router;
