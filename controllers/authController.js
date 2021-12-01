/* eslint-disable no-useless-constructor */

import { HttpCodes } from '../constants.js'
import { AuthService } from '../services/index.js'

class AuthController {
  constructor() { }

  static async registrationCtrl(req, res) {
    const { email, password } = req.body
    const user = await AuthService.registration(email, password)
    res.json({
      success: true,
      code: HttpCodes.OK,
      user: {
        email: user.email,
        subscription: user.subscription
      },
      message: `User '${email}' registered.`
    })
  }

  static async loginCtrl(req, res) {

  }

  static async logoutCtrl(req, res) {

  }

  static async findCurrentUserCtrl(req, res) {

  }
}

export default AuthController
