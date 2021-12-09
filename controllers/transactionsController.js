/* eslint-disable no-useless-constructor */

import { HttpCodes } from '../constants.js';
import { TransactionsService } from '../services/index.js';

class TransactionsController {
  constructor() { }

  static async addTransactionCtrl(req, res) {
    const { _id } = req.user;
    const transaction = await TransactionsService.addTransaction(req.body, _id);
    return res.status(HttpCodes.CREATED).send({
      success: true,
      code: HttpCodes.CREATED,
      data: {
        transaction,
      },
      message: 'Transaction created!',
    });
  }

  static async getTransactionsCtrl(req, res) {
    const userTransactions = await TransactionsService.getTransactions(req);
    if (!userTransactions) {
      res.json({
        message: 'No transactions',
      });
    }

    return res.send({
      success: true,
      code: HttpCodes.OK,
      message: `All transactions of ${req.user.name}`,
      userTransactions,
    });
  }

  static async getTransactionCategoriesCtrl(req, res) {
    const { _id, name } = req.user
    const categories = await TransactionsService.getTransactionCategories(_id)
    return res.send({
      success: true,
      code: HttpCodes.OK,
      data: {
        categories,
      },
      message: `User ${name} transaction categories`
    })
  }

  static async getTransactionsStatisticCtrl(req, res) {
    const { _id, name } = req.user
    const { month, year } = req.query
    const statistic = await TransactionsService.getTransactionsStatistic(_id, month, year)
    return res.send({
      success: true,
      code: HttpCodes.OK,
      data: {
        statistic,
      },
      message: `User ${name} income and expense statistics`
    })

  }

  static async addTransactionCategoriesCtrl(req, res) {
    const { _id } = req.user
    const { name } = req.body
    const category = await TransactionsService.addTransactionCategory(_id, name)
    return res.status(HttpCodes.CREATED).send({
      success: true,
      code: HttpCodes.CREATED,
      data: {
        category,
      },
      message: `User added a category`
    })
  }
}

export default TransactionsController;
