import _ from "lodash";
import { useLoginRepo } from "./LoginRepo";

export const useLoginService = () => {
  const login = async ({ username, password }: any) => {
    try {
      const { login } = useLoginRepo();
      return await login({ username, password });
      // return {};
    } catch (error: any) {
      throw new Error(`Error in login Service: ${error.message}`);
    }
  };

  return { login };
};
