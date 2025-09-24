// db.js
const pgp = require('pg-promise')();
const db = pgp(process.env.LOG_DB_URL || process.env.DATABASE_URL); // TimescaleDB or same DB

async function initLogsTable() {
  // This query is now idempotent and won't fail on subsequent runs.
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS service_logs (
      id SERIAL NOT NULL,
      request_id UUID NOT NULL,
      level VARCHAR(10) NOT NULL,
      message TEXT,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT now(),
      PRIMARY KEY (created_at, id)
    );
  `;

  // This query is also idempotent.
  const createHypertableQuery = `
    SELECT create_hypertable('service_logs', 'created_at', if_not_exists => TRUE);
  `;

  try {
    await db.none(createTableQuery);
    await db.any(createHypertableQuery); // Use .any() to allow the query to return data
    console.log('✅ service_logs table is ready');
  } catch (error) {
    // Ignore "relation already exists" errors for the hypertable, as it's a known race condition.
    if (error.code !== '42P07') {
      console.error("Error initializing logs table:", error);
      throw error; // Rethrow other errors
    }
    console.log('✅ service_logs hypertable already exists');
  }
}

module.exports = { db, initLogsTable };
