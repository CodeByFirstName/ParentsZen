// controllers/searchController.js
const User = require('../models/user');
const Review = require('../models/review'); // N'oublie pas d'importer Review pour les avis

// Helper: Vérifie si une disponibilité couvre une plage horaire demandée
function isAvailableInRange(availability, day, startTime, endTime) {
  return availability.some(slot => {
    return (
      slot.day === day &&
      slot.startTime <= startTime &&
      slot.endTime >= endTime
    );
  });
}

// Rechercher des babysitters selon des critères définis par un parent
exports.searchBabysitters = async (req, res) => {
  try {
    const {
      location,
      budget,
      day,
      startTime,
      endTime,
      skills,
      minExperience,
      minRating,
      gender
    } = req.query;

    let query = { role: 'babysitter' };

    if (location) query['babysitterProfile.location'] = location;
    if (budget) query['babysitterProfile.hourlyRate'] = { $lte: Number(budget) };
    if (skills) {
      const skillsArray = skills.split(',');
      query['babysitterProfile.skills'] = { $all: skillsArray };
    }
    if (minExperience) {
      query['babysitterProfile.experience'] = { $exists: true, $ne: '' };
    }

    // ✅ On ajoute le filtre par genre ici
    if (gender && ['Homme', 'Femme'].includes(gender.toLowerCase())) {
        query.gender = gender.toLowerCase();
        }

    let babysitters = await User.find(query);

    babysitters = babysitters.filter(b => {
      let ok = true;

      if (day && startTime && endTime) {
        ok = isAvailableInRange(b.babysitterProfile.availability, day, startTime, endTime);
      }

      if (ok && minExperience) {
        const exp = parseInt(b.babysitterProfile.experience);
        ok = !isNaN(exp) && exp >= parseInt(minExperience);
      }

      return ok;
    });
    

    if (minRating) {
      const minRatingNum = Number(minRating);

      const reviewsPromises = babysitters.map(async babysitter => {
        const reviews = await Review.find({ babysitter: babysitter._id });
        if (reviews.length === 0) return null;

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        if (avgRating >= minRatingNum) {
          return {
            ...babysitter.toObject(),
            averageRating: avgRating.toFixed(2),
          };
        }
        return null;
      });

      babysitters = (await Promise.all(reviewsPromises)).filter(x => x !== null);
    }

    res.status(200).json(babysitters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la recherche.' });
  }
};

// Rechercher des parents selon des critères définis par un babysitter
exports.searchParents = async (req, res) => {
  try {
    const {
      location,
      maxChildren,
      day,
      startTime,
      endTime,
      minAge,
      maxAge,
      specialNeeds
    } = req.query;

    let query = { role: 'parent' };

    if (location) query['profile.location'] = location;
    if (maxChildren) query['profile.numberOfChildren'] = { $lte: Number(maxChildren) };
    if (specialNeeds) {
      const needsArray = specialNeeds.split(',');
      query['profile.specialNeeds'] = { $all: needsArray };
    }
    if (minAge || maxAge) {
      query['profile.childrenAgeRange'] = { $exists: true };
    }

    let parents = await User.find(query);

    parents = parents.filter(p => {
      let ok = true;

      if (day && startTime && endTime) {
        ok = isAvailableInRange(p.profile.availability, day, startTime, endTime);
      }

      if (ok && (minAge || maxAge)) {
        const ageRange = p.profile.childrenAgeRange;
        if (!ageRange) return false;
        const [min, max] = ageRange;

        if (minAge && max < parseInt(minAge)) ok = false;
        if (maxAge && min > parseInt(maxAge)) ok = false;
      }

      return ok;
    });

    res.status(200).json(parents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la recherche.' });
  }
};
