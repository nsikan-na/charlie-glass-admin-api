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

      const [rows, fields]: any = await connection.execute(query, [
        username,
        password,
      ]);

      connection.end();

      if (rows.length === 0) {
        return "Invalid username or password";
      }

      return rows[0];
    } catch (error: any) {
      throw new Error(`Error in login Repo: ${error.message}`);
    }
  };

  return {
    login,
  };
};
