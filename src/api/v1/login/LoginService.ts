import jwt from "jsonwebtoken";
import _ from "lodash";
import { useLoginRepo } from "./LoginRepo";
import ValidationError from "../../../interfaces/errors/ValidationError";
import UnAuthError from "../../../interfaces/errors/UnAuthErrorr";

export const EXPIRATION_TIME = "3hr";

export const useLoginService = () => {
  const login = async ({ username, password }: any) => {
    if (!username) {
      throw new ValidationError("Please enter valid username.");
    }
    if (!password) {
      throw new ValidationError("Please enter valid password.");
    }
    try {
      const { login: loginRepo } = useLoginRepo();
      const queryResult = await loginRepo({ username, password });

      if (queryResult.length === 0) {
        throw new UnAuthError();
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
      if (error instanceof UnAuthError) {
        throw new UnAuthError();
      }
      throw new Error(`${error.message}`);
    }
  };

  return { login };
};
