import db from "../../../config/db-config/db";

export const useReportRepo = ({ user_id }: { user_id: string }) => {
  const getProfitData = async ({ toDate, fromDate, user_id }: any) => {
    const client = await db.connect();
    try {
      let query = `
        SELECT
          "signature_date",
          "revenue",
          "expense",
          "profit"
        FROM profit_report_view
        WHERE "user_id" = $1
      `;
      const params = [user_id];

      if (toDate && fromDate) {
        query += ` AND "signature_date" BETWEEN $2 AND $3`;
        params.push(fromDate, toDate);
      }

      query += " ORDER BY signature_date DESC";

      const { rows } = await client.query(query, params);
      return rows;
    } catch (error) {
      console.error(`Error in getProfitData: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  };

  const getServiceData = async ({ toDate, fromDate, user_id }: any) => {
    const client = await db.connect();
    try {
      let query = `
        SELECT
          "service_id",
          "service_label",
          SUM("service_count") AS "service_count"
        FROM service_count_report_view
        WHERE "user_id" = $1
      `;
      const params = [user_id];

      if (toDate && fromDate) {
        query += ` AND "signature_date" BETWEEN $2 AND $3`;
        params.push(fromDate, toDate);
      }

      query += " GROUP BY service_id, service_label";

      const { rows } = await client.query(query, params);
      return rows;
    } catch (error) {
      console.error(`Error in getServiceData: ${error}`);
      throw error;
    } finally {
      client.release();
    }
  };

  return {
    getProfitData,
    getServiceData,
  };
};
