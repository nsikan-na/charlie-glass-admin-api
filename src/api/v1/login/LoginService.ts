import jwt from "jsonwebtoken";
import _ from "lodash";
import { useLoginRepo } from "./LoginRepo";
import ValidationError from "../../../interfaces/ValidationError";

export const EXPIRATION_TIME = "3hr";

export const useLoginService = () => {
  const login = async ({ username, password }: any) => {
    if (!username) {
      throw new ValidationError("Please enter username.");
    }
    if (!username) {
      throw new ValidationError("Please enter password.");
    }
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
      throw new Error(`${error.message}`);
    }
  };

  return { login };
};
