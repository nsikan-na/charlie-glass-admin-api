import jwt from "jsonwebtoken";
import _ from "lodash";
import { useLoginRepo } from "./LoginRepo";

// export const EXPIRATION_TIME = "1hr";
export const EXPIRATION_TIME = "60s";

export const useLoginService = () => {
  const login = async ({ username, password }: any) => {
    try {
      const { login: loginRepo } = useLoginRepo();
      const queryResult = await loginRepo({ username, password });

      if (queryResult.length === 0) {
        throw new Error("Invalid username or password");
      }

      const user = queryResult[0];

      const accessToken = jwt.sign(
        { username: user.userName, userId: user.userId },
        process.env.JWT_SECRET as string,
        {
          expiresIn: EXPIRATION_TIME,
        }
      );

      return { ...user, accessToken, expirationMs: EXPIRATION_TIME };
    } catch (error: any) {
      throw new Error(`Error in login Service: ${error.message}`);
    }
  };

  return { login };
};
