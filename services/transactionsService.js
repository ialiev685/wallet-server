import { Transaction, User } from '../models/index.js';
import { BadRequestError } from '../helpers/index.js';

class ContactsService {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}
  static async addTransaction(body, owner) {
    const user = await User.findById(owner);
    let balance;
    if (body.transactionType) {
      balance = user.balance + body.sum;
    } else {
      balance = user.balance - body.sum;
    }
    const [day, month, year] = body.date.split('.');
    const transaction = await Transaction.create({
      ...body,
      day,
      month,
      year,
      owner,
      balance,
    });
    await User.findByIdAndUpdate(owner, {
      balance: balance,
    });

    return transaction;
  }
  static async getTransactions(req) {
    const { _id } = req.user;
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const pages = await Transaction.find({ owner: _id });

    const transactions = await Transaction.find(
      { owner: _id },
      'date transactionType category comment sum balance',
    )
      .sort({ year: -1, month: -1, day: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(pages.length / limit);
    const data = {
      totalTransactions: pages.length,
      totalPages: totalPages,
      transactions,
    };
    return data;
  }

  static async getTransactionCategories() {}

  static async getTransactionsStatistic() {}
}
export default ContactsService;
