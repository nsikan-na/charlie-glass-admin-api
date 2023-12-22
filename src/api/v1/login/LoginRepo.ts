import dbConnection from "../../../config/db-connection";
import logger from "../../../util/logger";

export const useLoginRepo = () => {
  const login = async ({ username, password }: any) => {
    try {
      const connection = await dbConnection();
      let query = `
        SELECT name
        FROM user
        WHERE username = ?
        and password = ?
        and isActive = '1'
      `;

      logger.log(query);

      const [rows, fields] = await connection.execute(query, [
        username,
        password,
      ]);

      connection.end();
      console.log(rows);
      return rows;
    } catch (error: any) {
      throw new Error(`Error in getProfitData Repo: ${error.message}`);
    }
  };

  return {
    login,
  };
};
