const winston = require('winston');
const { db } = require('./db');
const Transport = require('winston-transport');

// The function to write logs to the database remains the same.
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

// Here we define a proper custom transport.
class DbTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // The 'info' object is the log object itself.
    // We can pass it directly to our database logging function.
    logToDB(info);

    callback();
  }
}

const createLogger = () =>
  winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      // We replace the broken Stream transport with our new DbTransport.
      new DbTransport(),
    ],
  });

module.exports = createLogger();
