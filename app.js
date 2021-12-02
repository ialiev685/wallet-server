import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.js'

import { transactionsRouter, authRouter } from './routes/api/index.js'
import { errorHandler } from './helpers/index.js'

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/transactions', transactionsRouter)
app.use('/api/users', authRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(errorHandler)
app.use((_, res) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Not found'
  })
})

export default app
