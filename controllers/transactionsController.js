/* eslint-disable no-useless-constructor */

import { HttpCodes } from '../constants.js'
import { TransactionsService } from '../services/index.js'

class TransactionsController {
  constructor() { }

  static async addTransactionCtrl(req, res) {
    const { _id } = req.user
    const transaction = await TransactionsService.addTransaction(req.body, _id)
    return res.send({
      success: true,
      code: HttpCodes.CREATED,
      data: {
        transaction,
      },
      message: 'Transaction created!'
    })
  }

  static async getTransactionsCtrl(req, res) {

  }

  static async getTransactionCategoriesCtrl(req, res) {

  }

  static async getTransactionsStatisticCtrl(req, res) {

  }
}

export default TransactionsController
