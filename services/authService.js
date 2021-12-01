import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import { NotAuthorizedError, ConflictError } from '../helpers/index.js'

class AuthService {
  // eslint-disable-next-line no-useless-constructor
  constructor() { }
  static async registration(email, password) {
    const foundEmail = await User.findOne({ email })
    if (foundEmail) {
      throw new ConflictError(`Email '${email}' in use .`)
    }
    const user = new User({ email, password })
    await user.save()
    return user
  }

  static async login(email, password) {
  
  }

  static async logout(id) {

  }

  static async findCurrentUser(id) {
 
  }
}

export default AuthService
