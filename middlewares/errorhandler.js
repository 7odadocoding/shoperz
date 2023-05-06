const logger = require('./logger');

const errHandler = (error, req, res, next) => {
  if (error) {
    logger.error(error);
    res.status(500).send('Internal Error!');
  }
};

module.exports = errHandler;
