import createError from 'http-errors';
import db from '@/database';
import axios from 'axios';
import { tokenHelper } from '@/helpers';

/**
 * POST /auth/login
 * Login request
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email address
    const user = await db.models.user.findOne({ where: { email } });
    if (!user) {
      return next(createError(400, 'There is no user with this email address!'));
    }

    // Check user password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return next(createError(400, 'Incorrect password!'));
    }

    // Generate and return token
    const token = user.generateToken();
    const refreshToken = user.generateToken('1yr');
    return res.status(200).json({ token, refreshToken });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /auth/register
 * Register request
 */
export const register = async (req, res, next) => {
  try {
    // Create user
    const user = await db.models.user
      .create(req.body, {
        fields: ['firstName', 'lastName', 'email', 'password'],
      });

    // Generate and return tokens
    const token = user.generateToken();
    const refreshToken = user.generateToken('1yr');
    res.status(201).json({ token, refreshToken });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /auth/me
 * Get current user
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    delete req.user.dataValues.password;
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /auth/me
 * Update current user
 */
export const updateCurrentUser = async (req, res, next) => {
  try {
    await req.user.update(req.body, {
      fields: ['firstName', 'lastName', 'email'],
    });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /auth/me
 * Delete current user
 */
export const deleteCurrentUser = async (req, res, next) => {
  try {
    await req.user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /auth/me/password
 * Update password of current user
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { current, password } = req.body;

    // Check user password
    const isValidPassword = await req.user.validatePassword(current);
    if (!isValidPassword) {
      return next(createError(400, 'Incorrect password!'));
    }

    // Update password
    req.user.password = password;
    await req.user.save();

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /auth/google
 * Google login request
 */
export const googleLogin = async (req, res, next) => {
  try {
    const { token: authToken } = req.body;
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const { email } = profile;
    let user = await db.models.user.findOne({ where: { email } });
    if (!user) {
      // create new user
      const newUser = await db.models.user.create({
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        password: 'google',
      });
      user = newUser;
    }
    // Generate and return token
    const token = user.generateToken();
    const refreshToken = user.generateToken('1yr');
    return res.status(200).json({ token, refreshToken });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /auth/facebook
 * Facebook login request
 */

export const facebookLogin = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email address
    let user = await db.models.user.findOne({ where: { email } });
    if (!user) {
      // create new user
      const newUser = await db.models.user.create({ ...req.body, password: 'facebook' }, {
        fields: ['firstName', 'lastName', 'email', 'password'],
      });
      user = newUser;
    }


    // Generate and return token
    const token = user.generateToken();
    const refreshToken = user.generateToken('1yr');
    return res.status(200).json({ token, refreshToken });
  } catch (err) {
    return next(err);
  }
};

export const getRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokenData = await tokenHelper.verifyToken(refreshToken);

    // Find user from database
    const user = await db.models.user.findByPk(tokenData.id).catch(() => null);

    if (!user) {
      return next(createError(400, 'Invalid refresh token!'));
    }
    const newToken = user.generateToken();
    const newRefreshToken = user.generateToken('1yr');
    return res.status(200).json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    return next(err);
  }
};
