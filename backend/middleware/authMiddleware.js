const jwt = require('jsonwebtoken');
const User = require('../models/user');


const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
   

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1];
  

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
     

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = {
  userId: user._id, // ou user.id
  email: user.email, // facultatif
  role: user.role,   // si tu veux
};
    next();
  } catch (err) {
    
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }};
  
// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Accès refusé. Administrateur requis." });
  }
};



module.exports =  {  isAdmin,verifyToken };