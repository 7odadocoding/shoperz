const Responser = require('../utils/responser');
const logger = require('./logger');

const errHandler = (error, req, res, next) => {
  if (error) {
    logger.error(error);
    let responser = new Responser(error.status || 500, error.message || 'internal server error', null, {
      type: error.type || 'internal server error',
      errors: [error.message] || [],
    });
    responser.respond(res);
  }
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
    this.type = 'not_found';
  }
}

class InternalError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'InternalError';
    this.status = 500;
    this.type = 'internal_error';
    this.cause = cause;
  }
}

class ValidationError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ValidationError';
    this.status = 403;
    this.type = 'validation_error';
    this.cause = cause;
  }
}
class PaymentFailedError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'PaymentFailedError';
    this.status = 402;
    this.type = 'payment_failed';
    this.cause = cause;
  }
}

module.exports = {
  errHandler,
  NotFoundError,
  InternalError,
  ValidationError,
  PaymentFailedError,
};
