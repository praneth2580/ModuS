const winston = require('winston');

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


module.export = requestLoggerConsole;