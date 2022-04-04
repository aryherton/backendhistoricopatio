import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config = {
  user: `${process.env.NP_USERNAME}`,
  password: `${process.env.NP_PASSWORD}`,
  server: `${process.env.NP_MSSQL_SERVER}`,
  port: Number(process.env.NP_MSSQL_PORT),
  database: `${process.env.NP_DATABASE_NAME}`,
  options: {
    encrypt: false,
    trustServerCertificate: false,
    enableArithAbort: true,
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect().then(() => console.log("SQL Conectado!"));

const select = async (query) => {
  let rootInfo;
  await poolConnect;
  await pool
    .request()
    .query(query)
    .then((result) => {
      rootInfo = result.recordset;
    })
    .catch((err) => {
      console.dir(err);
    });
  return rootInfo;
};

export default { select };
