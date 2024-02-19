import * as mysql from "mysql2/promise";

const dbConnection = async () => {
  const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.CGI_ADMIN_DB_HOST,
    user: process.env.CGI_ADMIN_DB_USER,
    password: process.env.CGI_ADMIN_DB_PASSWORD,
    database: process.env.CGI_ADMIN_DB_DATABASE,
    ssl: {
      rejectUnauthorized: true,
    },
  });

  return pool.getConnection();
};

export default dbConnection;
