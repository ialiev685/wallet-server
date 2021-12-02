/* eslint-disable no-useless-constructor */

import { HttpCodes } from '../constants.js';
import { AuthService } from '../services/index.js';

class AuthController {
  constructor() {}

  static async registrationCtrl(req, res) {
    const { email, password, name } = req.body;
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
      user: {
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

  static async findCurrentUserCtrl(req, res) {}
}

export default AuthController;
