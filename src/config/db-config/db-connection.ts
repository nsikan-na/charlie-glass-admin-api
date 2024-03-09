import { Pool } from "pg";

const dbConnection = async () => {
  const pool = new Pool({
    max: 10, // Maximum number of connections in the pool
    host: process.env.CGI_ADMIN_DB_HOST,
    user: process.env.CGI_ADMIN_DB_USER,
    password: process.env.CGI_ADMIN_DB_PASSWORD,
    database: process.env.CGI_ADMIN_DB_DATABASE,
    port: Number(process.env.CGI_ADMIN_DB_PORT) || 5432, // Default PostgreSQL port
    ssl: {
      rejectUnauthorized: true, // This needs to be true to reject unauthorized connections
    },
  });

  // The Pool object automatically manages a pool of connections.
  // You can directly query with pool without manually managing individual connections.
  // For example: const res = await pool.query('SELECT NOW()');

  return pool; // Return the pool for querying
};

export default dbConnection;
