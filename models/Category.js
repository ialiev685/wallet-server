import mongoose from 'mongoose'
import Joi from 'joi'
const { Schema } = mongoose

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Add transaction category ']
    },
    hex: {
      type: String
    },
    owner: {
      type: mongoose.ObjectId,
      ref: 'user',
    },
    basic: {
      type: String
    }
  }, {
    versionKey: false
  }
)
const joiCategorySchema = Joi.object({
  name: Joi.string().required(),
  hex: Joi.string().optional(),
  owner: Joi.string().optional(),
  basic: Joi.string().optional()
})

const Category = mongoose.model('category', categorySchema)

export { Category, joiCategorySchema }
