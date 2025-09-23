const logger = require('../logger');

const errorHandler = (err, req, res, next) => {
  const requestId = req.requestId || 'N/A';

  logger.error(
    JSON.stringify({
      requestId,
      level: 'error',
      message: err.message,
      metadata: {
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
      },
    }),
  );

  res.status(500).json({
    message: 'Internal server error',
    requestId, // send UUID back to client
  });
};

module.exports = errorHandler;
