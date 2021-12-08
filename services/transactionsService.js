import { Transaction, User, Category } from '../models/index.js';
import { getRanHex, BadRequestError, generateId } from '../helpers/index.js';

class ContactsService {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}
  static async addTransaction(body, owner) {
    const { sum } = body;
    const [trMonth, trDay, trYear] = body.date.split('.');
    const user = await User.findById(owner);

    let userBalance;

    if (body.transactionType) {
      userBalance = user.balance + sum;
    } else {
      userBalance = user.balance - sum;
    }

    await User.findByIdAndUpdate(owner, {
      balance: userBalance,
    });
    const nextTransactions = await Transaction.aggregate([
      { $match: { owner }, $match: { date: { $gte: new Date(body.date) } } },
    ]);
    const previousTransactions = await Transaction.aggregate([
      { $match: { owner }, $match: { date: { $lt: new Date(body.date) } } },
    ]).sort({ date: -1 });
    const previousTransaction = previousTransactions[0];

    if (nextTransactions.length === 0) {
      const transaction = await Transaction.create({
        ...body,
        trDay,
        trMonth,
        trYear,
        owner,
        balance: userBalance,
      });
      return transaction;
    }

    if (previousTransaction) {
      if (body.transactionType) {
        userBalance = previousTransaction.balance + sum;
      } else {
        userBalance = previousTransaction.balance - sum;
      }
    } else {
      if (body.transactionType) {
        userBalance = sum;
      } else {
        userBalance = -sum;
      }
    }

    const transaction = await Transaction.create({
      ...body,
      trDay,
      trMonth,
      trYear,
      owner,
      balance: userBalance,
    });

    if (nextTransactions) {
      nextTransactions.map(async el => {
        const id = el._id;
        if (body.transactionType) {
          await Transaction.findByIdAndUpdate(id, {
            balance: el.balance + sum,
          });
        } else {
          await Transaction.findByIdAndUpdate(id, {
            balance: el.balance - sum,
          });
        }
      });
    }
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
      .sort({ trYear: -1, trMonth: -1, trDay: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category', 'name hex');

    const totalPages = Math.ceil(pages.length / limit);
    const data = {
      totalTransactions: pages.length,
      totalPages: totalPages,
      transactions,
    };
    return data;
  }

  static async getTransactionCategories(owner) {
    const userCategories = await Category.find({ owner });
    const basicCategories = await Category.find({ basic: 'basic' });
    const selectedUserCategories = userCategories.map(el => {
      const categoryObj = {
        name: el.name,
        id: el._id,
      };
      return categoryObj;
    });
    const selectedBasicCategories = basicCategories.map(el => {
      const categoryObj = {
        name: el.name,
        id: el._id,
      };
      return categoryObj;
    });
    const categories = [...selectedBasicCategories, ...selectedUserCategories];
    return categories;
  }

  static async getTransactionsStatistic(owner, month, year) {
    let transactions;

    if (year && month) {
      transactions = await Transaction.find({
        owner,
        trYear: year,
        trMonth: month,
        transactionType: false,
      }).populate('category', { name: 1, hex: 1, _id: 0 });
    }
    if (year && !month) {
      transactions = await Transaction.find({
        owner,
        trYear: year,
        transactionType: false,
      }).populate('category', { name: 1, hex: 1, _id: 0 });
    }
    if (!year && month) {
      transactions = await Transaction.find({
        owner,
        trYear: new Date().getFullYear(),
        trMonth: month,
        transactionType: false,
      }).populate('category', { name: 1, hex: 1, _id: 0 });
    }

    const statistic = transactions.reduce((acc, el) => {
      const name = el.category.name;
      const hex = el.category.hex;
      const sum = el.sum;

      return {
        ...acc,
        [name]: {
          name: name,
          sum: acc[name] ? acc[name].sum + sum : sum,
          hex,
          id: generateId(),
        },
      };
    }, {});

    return statistic;
  }

  static async addTransactionCategory(owner, name) {
    const findingCategory = await Category.find({ owner, name });

    if (findingCategory.length !== 0) {
      throw Error(
        new BadRequestError('The user already has this category name.'),
      );
    }
    const hex = getRanHex();
    const category = await Category.create({ name, hex, owner });
    return category;
  }
}

export default ContactsService;
