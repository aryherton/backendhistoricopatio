import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const configBr = {
  user: `${process.env.NP_USERNAME}`,
  password: `${process.env.NP_PASSWORD}`,
  server: `${process.env.NP_MSSQL_SERVER_BR}`,
  port: Number(process.env.NP_MSSQL_PORT),
  database: `${process.env.NP_DATABASE_NAME_BR}`,
  options: {
    encrypt: false,
    trustServerCertificate: false,
    enableArithAbort: true,
  },
};

const configConnect = {
  user: `${process.env.NP_USERNAME}`,
  password: `${process.env.NP_PASSWORD}`,
  server: `${process.env.NP_MSSQL_SERVER_CONNECT}`,
  port: Number(process.env.NP_MSSQL_PORT),
  database: `${process.env.NP_DATABASE_NAME_CONNECT}`,
  options: {
    encrypt: false,
    trustServerCertificate: false,
    enableArithAbort: true,
  },
};

const poolBr = new sql.ConnectionPool(configBr);
const poolConnectBr = poolBr.connect().then(() => console.log("SQL BR Conectado!"));

const poolConnect = new sql.ConnectionPool(configConnect);
const poolConnectConnect = poolConnect.connect().then(() => console.log("SQL Connect Conectado!"));

const selectBr = async (query) => {
  let rootInfo;
  await poolConnectBr;
  await poolBr
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

const selectConnect = async (query) => {
  let rootInfo;
  await poolConnectConnect;
  await poolConnect
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

export default { selectBr, selectConnect };
