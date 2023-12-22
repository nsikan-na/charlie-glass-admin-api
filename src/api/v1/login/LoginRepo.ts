import dbConnection from "../../../config/db-connection";
import logger from "../../../util/logger";

export const useLoginRepo = () => {
  const login = async ({ username, password }: any) => {
    try {
      //   const connection = await dbConnection();
      //   let query = `
      //   SELECT
      //   signature_date,
      //   revenue,
      //   expense,
      //   profit
      //   FROM profit_report_view
      //   WHERE user_id = ?
      // `;

      //   const params: (string | number)[] = [user_id];

      //   if (toDate && fromDate) {
      //     query += ` AND signature_date between ? and ?`;
      //     params.push(`${fromDate}`);
      //     params.push(`${toDate}`);
      //   }

      //   query += ` ORDER BY signature_date DESC`;

      //   logger.log(query);
      //   const [rows, fields] = await connection.execute(query, params);
      //   connection.end();
      // return rows;
      return "login";
    } catch (error: any) {
      throw new Error(`Error in getProfitData Repo: ${error.message}`);
    }
  };

  return {
    login,
  };
};
