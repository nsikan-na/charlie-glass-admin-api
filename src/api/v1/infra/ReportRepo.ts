import * as mysql from "mysql2/promise";

export const useReportRepo = ({ user_id }: { user_id: string }) => {
  const logger = console;
  // const pool = mysql.createPool({
  //   connectionLimit: 10, // Adjust as needed
  //   host: process.env.DB_HOST,
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASSWORD,
  //   database: process.env.DB_DATABASE,
  // });

  const getProfitData = async ({ toDate, fromDate }: any) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      let query = `
      SELECT 
      signature_date,
      revenue,
      expense,
      profit
      FROM profit_view
      WHERE user_id = ?
    `;

      const params: (string | number)[] = [user_id];

      if (toDate && fromDate) {
        query += ` AND signature_date between ? and ?`;
        params.push(`${fromDate}`);
        params.push(`${toDate}`);
      }

      query += ` ORDER BY signature_date DESC`;

      logger.log(query);
      const [rows, fields] = await connection.execute(query, params);
      connection.end();
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getAllQuotes Repo: ${error.message}`);
    }
  };
  const getServiceData = async ({ toDate, fromDate }: any) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      let query = `
      SELECT *
      FROM quote_service_view
      WHERE user_id = ?
    `;

      const params: (string | number)[] = [user_id];

      // if (toDate && fromDate) {
      //   query += ` AND signature_date between ? and ?`;
      //   params.push(`${fromDate}`);
      //   params.push(`${toDate}`);
      // }

      // query += ` ORDER BY signature_date DESC`;

      logger.log(query);
      const [rows, fields] = await connection.execute(query, params);
      connection.end();
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getAllQuotes Repo: ${error.message}`);
    }
  };

  return {
    getProfitData,
    getServiceData,
  };
};
