const express = require('express');
const passport = require('passport');
const router = express.Router();
const { 
  register, 
  login, 
  refreshToken, 
  logout,
  googleCallback,
  updateProfile,
  changePassword
} = require('../controllers/auth.controller');
const {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  validateProfile,
  validateChangePassword
} = require('../middleware/validation.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

// Public auth routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', validateRefreshToken, refreshToken);
router.post('/logout', validateRefreshToken, logout);

// Protected profile routes
router.put('/profile', verifyToken, validateProfile, updateProfile);
router.put('/change-password', verifyToken, validateChangePassword, changePassword);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login'
  }),
  googleCallback
);

module.exports = router;
