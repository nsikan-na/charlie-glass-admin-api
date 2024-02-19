import dbConnection from "../../../config/db-config/db-connection";

export const useReportRepo = ({ user_id }: { user_id: string }) => {
  const getProfitData = async ({ toDate, fromDate }: any) => {
    try {
      const connection = await dbConnection();
      let query = `
      SELECT 
      signature_date,
      revenue,
      expense,
      profit
      FROM profit_report_view
      WHERE user_id = ?
    `;

      const params: (string | number)[] = [user_id];

      if (toDate && fromDate) {
        query += " AND signature_date between ? and ?";
        params.push(`${fromDate}`);
        params.push(`${toDate}`);
      }

      query += " ORDER BY signature_date DESC";

      const [rows, fields] = await connection.execute(query, params);
      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };
  const getServiceData = async ({ toDate, fromDate }: any) => {
    try {
      const connection = await dbConnection();
      let query = `
      SELECT 
      service_id, 
      service_label,
      sum(service_count) as service_count
      FROM service_count_report_view
      where user_id = ?
    `;

      const params: (string | number)[] = [user_id];

      if (toDate && fromDate) {
        query += " AND signature_date between ? and ?";
        params.push(`${fromDate}`);
        params.push(`${toDate}`);
      }

      query += " group by service_id, service_label";

      const [rows, fields] = await connection.execute(query, params);
      connection.release();
      return rows;
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };

  return {
    getProfitData,
    getServiceData,
  };
};
