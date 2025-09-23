// logger.js
const winston = require('winston');
const db = require('./db');

const consoleLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

// Create a middleware for logging requests
const requestLoggerConsole = (req, res, next) => {
  consoleLogger.info(`${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next handler
};

const logToDB = async ({ requestId, level, message, metadata }) => {
  try {
    await db.none(
      'INSERT INTO service_logs(request_id, level, message, metadata) VALUES($1, $2, $3, $4)',
      [requestId, level, message, metadata],
    );
  } catch (err) {
    console.error('Failed to log to DB', err);
  }
};

const createLogger = () =>
  winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.Stream({
        stream: {
          write: (log) => {
            const parsed = JSON.parse(log);
            logToDB(parsed);
          },
        },
      }),
    ],
  });

module.exports = {
  createLogger,
  requestLoggerConsole
};
