const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../models');

const generateTokens = async (user) => {
  try {
    // Generate access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    // Calculate refresh token expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Save refresh token to database
    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt
    });

    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    throw new Error('Error generating tokens');
  }
};

const verifyRefreshToken = async (token) => {
  try {
    // Verify token signature
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Check if token exists in database
    const refreshToken = await RefreshToken.findOne({
      where: {
        token: token,
        userId: decoded.id
      }
    });

    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Check if token is expired
    if (new Date() > new Date(refreshToken.expiresAt)) {
      await refreshToken.destroy();
      throw new Error('Refresh token expired');
    }

    return decoded;
  } catch (error) {
    throw error;
  }
};

const deleteRefreshToken = async (token) => {
  try {
    await RefreshToken.destroy({
      where: {
        token: token
      }
    });
  } catch (error) {
    throw new Error('Error deleting refresh token');
  }
};

module.exports = {
  generateTokens,
  verifyRefreshToken,
  deleteRefreshToken
};
