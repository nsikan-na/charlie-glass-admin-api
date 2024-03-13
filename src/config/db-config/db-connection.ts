import * as mysql from "mysql2/promise";

const dbConnection = async () => {
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
      rejectUnauthorized: true,
    },
  });

  return pool.getConnection();
};

export default dbConnection;
