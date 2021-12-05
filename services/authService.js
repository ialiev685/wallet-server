import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { NotAuthorizedError, ConflictError } from '../helpers/index.js';

class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}
  static async registration(email, password, name) {
    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      throw new ConflictError(`Email '${email}' in use .`);
    }
    const user = new User({ email, password, name });
    await user.save();
    return user;
  }

  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotAuthorizedError(`No user with email '${email}' found.`);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new NotAuthorizedError('Wrong password.');
    }
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
    );
    await User.findOneAndUpdate({ email }, { token });
    return { token, user };
  }

  static async logout(_id) {
    await User.findByIdAndUpdate(_id, { token: null });
  }

  static async findCurrentUser(id) {
    const currentUser = await User.findById(id);
    return currentUser;
  }
}

export default AuthService;
