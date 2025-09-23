// db.js
const pgp = require('pg-promise')();
const db = pgp(process.env.LOG_DB_URL || process.env.DATABASE_URL); // TimescaleDB or same DB

async function initLogsTable() {
  await db.none(`
    CREATE TABLE IF NOT EXISTS service_logs (
      id SERIAL PRIMARY KEY,
      request_id UUID NOT NULL,
      level VARCHAR(10) NOT NULL,
      message TEXT,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT now()
    )
      
    -- Convert to hypertable
    SELECT create_hypertable('service_logs', 'created_at');
  `);

  console.log('✅ service_logs table ready');
}


db.connect()
  .then(obj => {
    console.log('Connected to the database');
    initLogsTable();
    // obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.error('ERROR:', error.message || error);
  });


module.exports = db;
