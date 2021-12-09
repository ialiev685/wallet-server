import mongoose from 'mongoose';
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

    if (!body.transactionType) {
      userBalance = user.balance + sum;
    } else {
      userBalance = user.balance - sum;
      console.log(user.balance, sum, userBalance);
    }

    await User.findByIdAndUpdate(owner, {
      balance: userBalance,
    });

    const nextTransactions = await Transaction.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(owner) } },
      { $match: { date: { $gte: new Date(body.date) } } },
    ]);

    const previousTransactions = await Transaction.aggregate([
      { $match: { owner: mongoose.Types.ObjectId(owner) } },
      { $match: { date: { $lt: new Date(body.date) } } },
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
      if (!body.transactionType) {
        userBalance = previousTransaction.balance + sum;
      } else {
        userBalance = previousTransaction.balance - sum;
      }
    } else {
      if (!body.transactionType) {
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
        if (!body.transactionType) {
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
    // const { page = 1, limit = 5 } = req.query;
    // const skip = (page - 1) * limit;
    // const pages = await Transaction.find({ owner: _id });
    const transactions = await Transaction.find(
      { owner: _id },
      'trDay trMonth trYear transactionType category comment sum balance',
    )
      .sort({ trYear: -1, trMonth: -1, trDay: -1 })
      // .skip(skip)
      // .limit(limit)
      .populate('category', 'name hex');

    const totalPages = Math.ceil(pages.length / limit);
    const data = {
      // totalTransactions: pages.length,
      // totalPages: totalPages,
      transactions,
    };
    return data;
  }

  static async getTransactionCategories(owner) {
    const userCategories = await Category.find({ owner }, 'name _id');
    const basicCategories = await Category.find({ basic: 'basic' }, 'name _id');

    const categories = [...basicCategories, ...userCategories];
    return categories;
  }

  static async getTransactionsStatistic(owner, trMonth, trYear) {
    let transactions;
    let statistic;

    if (!trYear && !trMonth) {
      transactions = await Transaction.find({ owner }).populate('category', {
        name: 1,
        hex: 1,
        _id: 0,
      });
    }
    if (trYear && !trMonth) {
      transactions = await Transaction.find({ owner, trYear }).populate(
        'category',
        { name: 1, hex: 1, _id: 0 },
      );
    }
    if (!trYear && trMonth) {
      transactions = await Transaction.find({ owner, trMonth }).populate(
        'category',
        { name: 1, hex: 1, _id: 0 },
      );
    }

    if (transactions.length !== 0) {
      statistic = transactions.reduce(
        (acc, el) => {
          const sum = el.sum;

          if (el.transactionType) {
            const name = el.category.name;
            const hex = el.category.hex;
            return {
              ...acc,
              expense: {
                ...acc.expense,
                [name]: {
                  name: name,
                  sum: acc.expense[name] ? acc.expense[name].sum + sum : sum,
                  hex,
                  id: generateId(),
                },
              },
              expenseBalance: acc.expenseBalance
                ? acc.expenseBalance + sum
                : sum,
            };
          }
          return {
            ...acc,
            incomeBalance: acc.incomeBalance ? acc.incomeBalance + sum : sum,
          };
        },
        { expense: {} },
      );
    }
    let incomeBalance = 0;
    let expenseBalance = 0;
    let expenseStatistic = [];

    if (statistic) {
      const { expense, incomeBalance = 0, expenseBalance = 0 } = statistic;
      expenseStatistic = Object.values(expense);

      return { expenseStatistic, incomeBalance, expenseBalance };
    }

    return { expenseStatistic, incomeBalance, expenseBalance };
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
