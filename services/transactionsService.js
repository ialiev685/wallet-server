import { Transaction, User } from '../models/index.js'
import { BadRequestError } from '../helpers/index.js'

class ContactsService {
  // eslint-disable-next-line no-useless-constructor
  constructor() { }
  static async addTransaction(body, owner) {
    const user = await User.findById(owner)
    let balance
    if (body.transactionType) {
      balance = user.balance + body.sum
    } else {
      balance=user.balance - body.sum
    }
    const [day, month, year] = body.date.split('.')
    const transaction = await Transaction.create({ ...body, day, month, year, owner, balance })
    await User.findByIdAndUpdate(owner, {
      balance: balance
    })

    return transaction
  }
  static async getTransactions() {
    
  }

  static async getTransactionCategories() {
    
  }

 static async getTransactionsStatistic() {
    
  }
}

export default ContactsService
