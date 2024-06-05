import db from '@/database';
import { tokenHelper } from '@/helpers';

export default async function authenticate(req, res, next) {
  // Get authorization header from request
  const authorization = req.headers.authorization || '';
  const refreshToken = req.headers.refreshtoken || '';

  // Firstly, set request user to null
  req.user = null;

  // Check for empty Authorization header
  if (!authorization) {
    return next();
  }

  // Make sure the token is bearer token
  if (!authorization.startsWith('Bearer ')) {
    return next();
  }

  // Extract token from header
  const token = authorization.substring(7);
  let tokenData;

  try {
    // Verify the token
    tokenData = await tokenHelper.verifyToken(token);
  } catch (error) {
    // If the token is expired and refresh token is provided
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        const refreshTokenData = await tokenHelper.verifyToken(refreshToken);

        // Find the user by ID from refresh token
        const user = await db.models.user.findByPk(refreshTokenData.id).catch(() => null);

        if (!user) {
          return next({ status: 401, message: 'There is no user' });
        }

        // Generate new tokens
        const newToken = user.generateToken();
        const newRefreshToken = user.generateToken('2h');

        // Set response headers
        res.setHeader('Token', newToken);
        res.setHeader('RefreshToken', newRefreshToken);

        // Set request user
        req.user = user;

        // Go to next middleware
        return next();
      } catch (refreshError) {
        return next({ status: 401, message: 'Invalid refresh token' });
      }
    }

    return next({ status: 401, message: 'Invalid or expired token' });
  }

  // Find user from database
  const user = await db.models.user.findByPk(tokenData.id).catch(() => null);

  // Check if user exists
  if (!user) {
    return next({ status: 401, message: 'There is no user' });
  }

  // Set request user
  req.user = user;

  // Check if the token renewal time is coming
  const now = new Date();
  const exp = new Date(tokenData.exp * 1000);
  const difference = exp.getTime() - now.getTime();
  const minutes = Math.round(difference / 60000);

  // Check for refresh token and time left
  if (refreshToken && minutes < 15) {
    // Verify refresh token and get refresh token data
    const refreshTokenData = await tokenHelper.verifyToken(refreshToken);

    // Check the user of refresh token
    if (refreshTokenData.id === tokenData.id) {
      // Generate new tokens
      const newToken = user.generateToken();
      const newRefreshToken = user.generateToken('2h');

      // Set response headers
      res.setHeader('Token', newToken);
      res.setHeader('RefreshToken', newRefreshToken);
    }
  }

  // Go to next middleware
  return next();
}
