import mongoose from 'mongoose'
import Joi from 'joi'
const { Schema } = mongoose

const categorySchema = new Schema(
  {
    categories: {
      type: Array
    },
    owner: {
      type: mongoose.ObjectId,
      ref: 'user',
    },
  }, {
    versionKey: false
  }
)
const joiCategorySchema = Joi.object({
  name: Joi.string().required(),
})

const Category = mongoose.model('category', categorySchema)

export { Category, joiCategorySchema }
