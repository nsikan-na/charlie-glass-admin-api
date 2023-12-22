import dbConnection from "../../../config/db-connection";
import logger from "../../../util/logger";

export const useLoginRepo = () => {
  const login = async ({ username, password }: any) => {
    try {
      const connection = await dbConnection();
      let query = `
        SELECT 
        id as userId, 
        name as userName
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

      connection.release();

      return rows;
    } catch (error: any) {
      throw new Error(`Error in login Repo: ${error.message}`);
    }
  };

  return {
    login,
  };
};
