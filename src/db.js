import pg from 'pg';


export const pool = new pg.Pool({
  user: "postgres.jkhbqtqhpayichzkjdkg",
  host: "aws-0-us-east-1.pooler.supabase.com",
  password: "CWbA0JuDUh5fIwM9",
  database: "projectw",
  port: 5432,
});



// export const pool = new pg.Pool({
//   user: "postgres",
//   host: "localhost",
//   password: "root",
//   database: "searchtest",
//   port: 5432,
// });
