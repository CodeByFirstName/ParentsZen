const review = require('../models/review');
const Review = require('../models/review');
const User = require('../models/user');
const mongoose = require('mongoose');


exports.createReview = async (req, res) => {
  try {
const { babysitterId } = req.params;
const { rating, comment } = req.body;


    // Vérification du rôle utilisateur
    if (req.user.role !== 'parent') {
      return res.status(403).json({ message: "Seuls les parents peuvent laisser un avis." });
    }

    // Vérifier que le baby-sitter existe
    const babysitter = await User.findById(babysitterId);
    if (!babysitter || babysitter.role !== 'babysitter') {
      return res.status(404).json({ message: "Baby-sitter introuvable." });
    }

     // ✅ Vérifier si ce parent a déjà laissé un avis pour ce baby-sitter
     const existingReview = await Review.findOne({
        babysitter: babysitterId,
        parent: new mongoose.Types.ObjectId(req.user.userId)
      });
      if (existingReview) {
        return res.status(400).json({ message: "Vous avez déjà laissé un avis pour ce baby-sitter." });
      }
  

    // Créer l'avis
    const review = new Review({
      babysitter: babysitterId,
      parent: req.user.userId,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({
      message: "Avis ajouté avec succès",
      review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


exports.getReviewsByBabysitter = async (req, res) => {
    try {
      const { babysitterId } = req.params;
  
      const reviews = await Review.find({ babysitter: babysitterId })
        .populate('parent', 'name') // Optionnel : pour afficher le nom du parent
        .sort({ createdAt: -1 }); // Pour afficher les plus récents d'abord
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
//   la note moyenne

 exports.getAverageRating = async (req, res) => {
    try {
      const { babysitterId } = req.params;
  
      const reviews = await Review.find({ babysitter: babysitterId });
  
      if (reviews.length === 0) {
        return res.status(404).json({ message: "Aucun avis pour ce baby-sitter." });
      }
  
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
  
      res.status(200).json({
        babysitterId,
        averageRating: averageRating.toFixed(2),
        numberOfReviews: reviews.length
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
//    update review

exports.updateReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
  
      // Rechercher l'avis
      const review = await Review.findById(reviewId);
  
      if (!review) {
        return res.status(404).json({ message: "Avis non trouvé." });
      }
  
      // Vérifier si l'utilisateur est bien le parent qui a laissé l'avis
      if (review.parent.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Vous n'avez pas l'autorisation de modifier cet avis." });
      }
  
      // Mettre à jour l'avis
      if (rating !== undefined) review.rating = rating;
      if (comment !== undefined) review.comment = comment;
  
      await review.save();
  
      res.status(200).json({
        message: "Avis mis à jour avec succès",
        review
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  exports.deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
  
      // Trouver l'avis
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Avis non trouvé." });
      }
  
      // Vérifier que c'est bien le parent qui a laissé l'avis qui veut le supprimer
      if (review.parent.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Vous ne pouvez pas supprimer cet avis." });
      }
  
      // Supprimer l'avis
      await Review.findByIdAndDelete(reviewId);
  
      res.status(200).json({ message: "Avis supprimé avec succès." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  };
   