import mongoose from 'mongoose'
import Joi from 'joi'
const { Schema } = mongoose

const TransactionSchema = new Schema(
  {
    transactionType: {
      type: Boolean,
      required: [true, 'Select the type of transaction: income(true) or expense(false)'],
    },
    sum: {
      type: Number,
      required: [true, 'Set transaction  sum '],
    },
    date: {
      type: String,
      required: [true, 'Set transaction date '],
    },
    comment: {
      type: String,
    },
    category: {
      type: String,
    },
    owner: {
      type: mongoose.ObjectId,
      ref: 'user',
    },
  }, {
    versionKey: false,
  }
)
const joiTransactionSchema = Joi.object({
  transactionType: Joi.boolean().required(),
  sum: Joi.number().required(),
  date: Joi.string().required(),
  category: Joi.string().optional(),
})

const Transaction = mongoose.model('transaction', TransactionSchema)

export { Transaction, joiTransactionSchema }
