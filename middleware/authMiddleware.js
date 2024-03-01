// middleware/authMiddleware.js
const passport = require('passport');

module.exports = (req, res, next) => {
  try {
    // Directly check if user is present without using passport.authenticate
    if (!req.userEmail) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
