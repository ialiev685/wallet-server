import { ServiceError } from '../helpers/index.js'
import { HttpCodes } from '../constants.js'

const asyncWrapper = (controller) => {
  return (req, res, next) => {
    controller(req, res).catch(next)
  }
}

const errorHandler = (err, req, res, next) => {
  if (err instanceof ServiceError) {
    return res.status(err.status).json({ message: err.message })
  }
 return res.status(HttpCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
}

export { asyncWrapper, errorHandler }
