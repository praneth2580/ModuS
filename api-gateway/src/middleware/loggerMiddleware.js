const { v4: uuidv4 } = require('uuid');
const { logger } = require('../logger');

const requestLogger = (req, res, next) => {
  const requestId = uuidv4();
  req.requestId = requestId;

  const startTime = Date.now();

  // Log incoming request by passing the object directly
  logger.info({
    requestId,
    message: 'Incoming request',
    metadata: {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
    },
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (body) {
    res.send = originalSend;
    res.send(body);

    const duration = Date.now() - startTime;
    // Log outgoing response by passing the object directly
    logger.info({
      requestId,
      message: 'Response sent',
      metadata: {
        statusCode: res.statusCode,
        body,
        duration,
      },
    });
  };

  next();
};

module.exports = requestLogger;
