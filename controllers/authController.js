/* eslint-disable no-useless-constructor */

import { HttpCodes } from '../constants.js';
import { AuthService } from '../services/index.js';

class AuthController {
  constructor() {}

  static async registrationCtrl(req, res) {
    const { email, password, name } = req.body;
    console.log('AuthController ~ registrationCtrl ~ name', name);
    const user = await AuthService.registration(email, password, name);
    res.json({
      success: true,
      code: HttpCodes.OK,
      user: {
        email: user.email,
        name: user.name,
      },
      message: `User '${user.name}' registered.`,
    });
  }

  static async loginCtrl(req, res) {
    const { email, password } = req.body;
    const { token, user } = await AuthService.login(email, password);
    res.json({
      success: true,
      code: HttpCodes.OK,
      token: token,
      userData: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      message: `User '${user.name}' is logged in successfully.`,
    });
  }

  static async logoutCtrl(req, res) {
    const { _id, name } = req.user;

    await AuthService.logout(_id);
    res.status(204).json({
      status: true,
      code: HttpCodes.NO_CONTENT,
      message: `User ${name} is logout`,
    });
  }

  static async findCurrentUserCtrl(req, res) {
    const { _id } = req.user;

    const currentUser = await AuthService.findCurrentUser(_id);
    res.json({
      status: true,
      code: HttpCodes.OK,
      data: {
        name: currentUser.name,
        email: currentUser.email,
        balance: currentUser.balance,
      },
    });
  }
}

export default AuthController;
