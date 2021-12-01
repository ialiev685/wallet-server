import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
const { Schema } = mongoose

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  name: {
    type: String,
   required: [true, 'Name is required'],
  },
})
const joiUserSchema = Joi.object({
  password: Joi.string().min(5).max(20).required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
})

userSchema.pre('save', async function () {
  if (this.isNew || this.isModified) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

const User = mongoose.model('user', userSchema)

export { User, joiUserSchema }
