import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import {
  NotAuthorizedError,
  ConflictError,
  sendMail,
} from '../helpers/index.js';

class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}
  static async registration(email, password, name) {
    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      throw new ConflictError(`Email '${email}' in use .`);
    }
    const user = new User({ email, password, name });
    await user.createVerifyToken();

    const { verifyToken } = user;
    console.log('AuthService ~ registration ~ verifyToken', verifyToken);
    const data = {
      to: email,
      subject: 'Сonfirmation of registration in the Wallet-service',
      html: `To confirm your e-mail follow the link: <a href="https://wallet-rf1.herokuapp.com/api/users/verify/${verifyToken}">Сonfirm registration</a>`,
    };

    await sendMail(data);
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
    if (!user.verify) {
      throw new NotAuthorizedError('Email not confirmed.');
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

  static async verifyUser(verifyToken) {
    const user = await User.findOne({ verifyToken });
    if (!user) {
      throw new ConflictError(`User not found`);
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
    );
    await User.findByIdAndUpdate(user._id, {
      verifyToken: null,
      verify: true,
      token,
    });

    return { token, user };
  }
}

export default AuthService;
