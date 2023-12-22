import { useReportRepo } from "../infra/ReportRepo";
import _ from "lodash";

export const useReportService = ({ user_id }: { user_id: string }) => {
  const getProfitData = async ({ fromDate, toDate }: any) => {
    try {
      const { getProfitData } = useReportRepo({ user_id });
      const queryResult: any = await getProfitData({
        fromDate,
        toDate,
      });
      const totalRevenue = queryResult.reduce(
        (acc: any, curr: any) => acc + +curr.revenue,
        0
      );
      const totalExpense = queryResult.reduce(
        (acc: any, curr: any) => acc + +curr.expense,
        0
      );
      const totalProfit = queryResult.reduce(
        (acc: any, curr: any) => acc + +curr.profit,
        0
      );

      return { rows: queryResult, totalRevenue, totalExpense, totalProfit };
    } catch (error: any) {
      throw new Error(`Error in getProfitData Service: ${error.message}`);
    }
  };

  return { getProfitData };
};
