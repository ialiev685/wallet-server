import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import { v4 } from 'uuid';
const { Schema } = mongoose;

const emailRegexp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: emailRegexp,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    token: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  {
    versionKey: false,
  },
);

const joiUserSchema = Joi.object({
  password: Joi.string().min(5).max(20).required(),
  email: Joi.string().email().required(),

  name: Joi.string(),
});

userSchema.pre('save', async function () {
  if (this.isNew || this.isModified) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.createVerifyToken = function () {
  this.verifyToken = v4();
};

const User = mongoose.model('user', userSchema);

export { User, joiUserSchema };
