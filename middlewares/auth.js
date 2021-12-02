import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../helpers/index.js';
import { User } from '../models/index.js';

const authMiddleware = async (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(' ');
    if (!token) {
      next(new NotAuthorizedError('Invalid token'));
    }

    const realUser = await User.findOne({ token });
    if (!realUser) {
      next(new NotAuthorizedError('Invalid token'));
    }

    const user = jwt.decode(token, process.env.JWT_SECRET);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(new NotAuthorizedError('Please, provide a token'));
  }
};
export default authMiddleware;
