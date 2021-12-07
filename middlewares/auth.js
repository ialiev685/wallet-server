import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../helpers/index.js';
import { User } from '../models/index.js';

const authMiddleware = async (req, res, next) => {
  try {
     const [bearer , token] = req.headers.authorization.split(' ')
    if (!token) {
      throw Error(new NotAuthorizedError('Invalid token'))
    }

    const realUser = await User.findOne({ token });
    
    if (!realUser) {
      throw Error(new NotAuthorizedError('Invalid token'))
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
