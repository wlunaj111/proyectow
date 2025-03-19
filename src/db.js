import pg from 'pg';


export const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "root",
  database: "searchtest",
  port: 5432,
});
