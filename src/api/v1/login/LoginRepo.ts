import pool from "../../../config/db-config/pool";
import { encrypt } from "../../../util/encryption";

export const useLoginRepo = () => {
  const login = async ({ username, password }: any) => {
    try {
      const query = `
        SELECT
        id as "userId",
        name as "userName"
        FROM "user"
        WHERE username = $1
        AND password = $2
        AND "isActive" = '1'
      `;

      const encryptedPassword = encrypt(password);
      const client = await pool.connect();
      const { rows } = await client.query(query, [username, encryptedPassword]);

      return rows;
    } catch (error: any) {
      console.log(error);
    }
  };

  return {
    login,
  };
};
