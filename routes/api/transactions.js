import express from 'express'
import { TransactionsController } from '../../controllers/index.js'
import { vld, authMiddleware } from '../../middlewares/index.js'
import { asyncWrapper } from '../../helpers/index.js'
import { joiTransactionSchema } from '../../models/Transaction.js'

const router = express.Router()

const addValidation = vld(joiTransactionSchema)


router.use(authMiddleware)

router.get('/', asyncWrapper(TransactionsController.getTransactionsCtrl))

router.get('/categories', asyncWrapper(TransactionsController.getTransactionCategoriesCtrl))

router.get('/statistic', asyncWrapper(TransactionsController.getTransactionsStatisticCtrl))

router.post('/', addValidation, asyncWrapper(TransactionsController.addTransactionCtrl))

router.post('/categories', asyncWrapper(TransactionsController.addTransactionCategoriesCtrl))



export default router