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
      FROM profit_report_view
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
      throw new Error(`Error in getProfitData Repo: ${error.message}`);
    }
  };
  const getServiceData = async ({ toDate, fromDate }: any) => {
    try {
      const connection = await mysql.createConnection(
        process.env.DATABASE_URL || ""
      );
      let query = `
      SELECT 
      service_id, 
      service_label,
      sum(service_count) as service_count
      FROM service_count_report_view
      where user_id = ?
    `;

      const params: (string | number)[] = [user_id];

      if (toDate && fromDate) {
        query += ` AND signature_date between ? and ?`;
        params.push(`${fromDate}`);
        params.push(`${toDate}`);
      }

      query += ` group by service_id, service_label`;

      logger.log(query);
      const [rows, fields] = await connection.execute(query, params);
      connection.end();
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getServiceData Repo: ${error.message}`);
    }
  };

  return {
    getProfitData,
    getServiceData,
  };
};
