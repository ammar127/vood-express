/* eslint-disable camelcase */
import createError from 'http-errors';
import db from '@/database';
import axios from 'axios';
import { tokenHelper } from '@/helpers';
import { createAccount, createAccountLink } from '@/helpers/stripe';
import { Op } from 'sequelize';

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
    const { email } = req.body;

    // Check if user already exists
    const userExists = await db.models.user.findOne({ where: { email } });
    if (userExists) {
      return next(createError(400, 'User already exists!'));
    }

    const userObj = { ...req.body, username: req.body.firstName + Date.now() };
    // Create user
    const user = await db.models.user
      .create(userObj, {
        fields: ['firstName', 'lastName', 'email', 'password', 'username'],
      });

    // Generate and return tokens
    const token = user.generateToken();
    const refreshToken = user.generateToken('1yr');
    return res.status(201).json({ token, refreshToken });
  } catch (err) {
    return next(err);
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
      fields: ['firstName', 'lastName', 'email', 'username', 'image', 'cover'],
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
        username: profile.given_name + Date.now(),
        password: `google-${Date.now()}`,
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
      const newUser = await db.models.user.create({
        ...req.body,
        username: req.body.firstName + Date.now(),
        password: `facebook-${Date.now()}`,
      }, {
        fields: ['firstName', 'lastName', 'email', 'password', 'username'],
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

export const connectStripe = async (req, res, next) => {
  try {
    const { user } = req;
    const { email, stripe_customer_id } = user;
    if (!stripe_customer_id) {
      const acountId = await createAccount(email);
      user.stripe_customer_id = acountId;
      await user.save();
    }
    const url = await createAccountLink(user.stripe_customer_id);
    return res.status(200).json(url);
  } catch (error) {
    return next(error);
  }
};

export const checkEmailUnique = async (req, res, next) => {
  try {
    const { email } = req.params;
    const query = {
      where: {
        email,
      },
    };

    if (req.user) {
      query.where.id = { [Op.ne]: req.user.id };
    }

    const user = await db.models.user.findOne(query);

    if (user) {
      return res.json({ unique: false });
    }
    return res.json({ unique: true });
  } catch (err) {
    return next(err);
  }
};

export const checkUsernameUnique = async (req, res, next) => {
  try {
    const { username } = req.params;
    const query = {
      where: {
        username,
      },
    };
    if (req.user) {
      query.where.id = { [Op.ne]: req.user.id };
    }

    const user = await db.models.user.findOne(query);

    if (user) {
      return res.json({ unique: false });
    }
    return res.json({ unique: true });
  } catch (err) {
    return next(err);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await db.models.user.findOne({ where: { username } });
    if (!user) {
      return next(createError(404, 'User not found!'));
    }
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};
