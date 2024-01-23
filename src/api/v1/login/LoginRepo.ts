import dbConnection from "../../../config/db-config/db-connection";

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

      const [rows, fields]: any = await connection.execute(query, [
        username,
        password,
      ]);

      connection.release();

      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  return {
    login,
  };
};
