import dbConnection from "../../../config/db-config/db-connection";
import { encrypt } from "../../../util/encryption";

export const useLoginRepo = () => {
  const login = async ({ username, password }: any) => {
    try {
      const pool = await dbConnection();
      const query = `
        SELECT 
        id as "userId", 
        name as "userName"
        FROM "user"
        WHERE username = $1
        AND password = $2
        AND "isActive" = '1'
      `;

      // Encrypt the password before comparing
      const encryptedPassword = encrypt(password);

      // Use query method directly on the pool for a single query
      const { rows } = await pool.query(query, [username, encryptedPassword]);

      // No need to release the connection explicitly when using pool.query

      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  return {
    login,
  };
};
