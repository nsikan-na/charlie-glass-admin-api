import { Pool } from "pg";

const pool = new Pool({
  host: "aws-0-us-west-1.pooler.supabase.com",
  user: "postgres.lawsviksltokhmwjqpll",
  password: "UQ5XfH3yXuA7j0nk",
  database: "postgres",
  port: Number("6543") || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
