import { HttpCodes } from '../constants.js'

class ServiceError extends Error {
  constructor(message) {
    super(message)
    this.status = HttpCodes.BAD_REQUEST
  }
}

class ValidationError extends ServiceError {
  constructor(message) {
    super(message)
    this.status = HttpCodes.BAD_REQUEST
  }
}

class BadRequestError extends ServiceError {
  constructor(message) {
    super(message)
    this.status = HttpCodes.BAD_REQUEST
  }
}
class ConflictError extends ServiceError {
  constructor(message) {
    super(message)
    this.status = HttpCodes.CONFLICT
  }
}

class NotAuthorizedError extends ServiceError {
  constructor(message) {
    super(message)
    this.status = HttpCodes.UNAUTHORIZED
  }
}

export { ServiceError, ValidationError, BadRequestError, ConflictError, NotAuthorizedError }
