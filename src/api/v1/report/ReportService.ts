import { useReportRepo } from "./ReportRepo";
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
      console.log(error);
    }
  };
  const getServiceData = async ({ fromDate, toDate }: any) => {
    try {
      const { getServiceData } = useReportRepo({ user_id });
      const queryResult: any = await getServiceData({
        fromDate,
        toDate,
      });

      return queryResult;
    } catch (error: any) {
      console.log(error);
    }
  };

  return { getProfitData, getServiceData };
};
