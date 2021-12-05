import { Transaction, User, Category } from '../models/index.js'
import { BadRequestError } from '../helpers/index.js'

class ContactsService {
  // eslint-disable-next-line no-useless-constructor
  constructor() { }
  static async addTransaction(body, owner) {
    const {sum}=body
    const [trDay,trMonth, trYear] = body.date.split('.')
    const user = await User.findById(owner)
    
    let userBalance

    if (body.transactionType) {
      userBalance = user.balance + sum
    } else {
      userBalance = user.balance - sum
    }
  
    await User.findByIdAndUpdate(owner, {
      balance: userBalance
    })
    const nextTransactions = await Transaction.aggregate([{ $match: {owner}, $match: {  date: { '$gte': new Date(body.date) }  } }])
    const previousTransactions = await Transaction.aggregate([{ $match: {owner},$match: { date: { '$lt': new Date(body.date) }  }}]).sort({ date: -1 })
    const previousTransaction = previousTransactions[0]
    console.log(previousTransaction);
    if (nextTransactions.length===0) {
      const transaction = await Transaction.create({ ...body, trDay, trMonth, trYear, owner, balance: userBalance })
      return transaction
    }
    
    if (previousTransaction) {
       if (body.transactionType) {
      userBalance = previousTransaction.balance + sum
    } else {
      userBalance = previousTransaction.balance - sum
      }
    } else {
      if (body.transactionType) {
      userBalance =  sum
    } else {
      userBalance = -sum
      }
    }
    
    const transaction = await Transaction.create({ ...body, trDay, trMonth, trYear, owner, balance: userBalance })

    if (nextTransactions) {
      console.log(nextTransactions);
      nextTransactions.map(async (el) => {
        const id = el._id
        if (body.transactionType) {
          await Transaction.findByIdAndUpdate(id, {balance: el.balance+sum})
        } else {
          await Transaction.findByIdAndUpdate(id, { balance: el.balance - sum })
        } 
      })
    }


    return transaction
  }

  static async getTransactions() {
    
  }

  static async getTransactionCategories() {
    
  }

  static async getTransactionsStatistic(owner) {
    const transactions = await Transaction.find({owner})
    const statistic = transactions.reduce((acc,el) => {
      const category = el.category
      const sum = el.sum
    
      return {
        ...acc,
        [category]: acc[category] ? acc[category] + sum : sum
      }
    }, {})

      return statistic
  }

 static async addTransactionCategoriesCtrl(req, res) {

  }
}

export default ContactsService
