import sqlServer from "../database/sqlServer.js";

class AlvosService {
  async findTarget(query) {
    const { codCliente, nomeAlvo } = query;

    let alvos;

    if (codCliente && nomeAlvo) {
      alvos = await sqlServer.select(
        `SELECT TOP (150) * FROM ALVO WHERE ALV_CODCLN = ${codCliente} AND ALV_NOME LIKE '%${nomeAlvo.toUpperCase()}%'`
      );
    } else if (codCliente) {
      alvos = await sqlServer.select(
        `SELECT TOP (150) * FROM ALVO WHERE ALV_CODCLN = ${codCliente}`
      );
    } else {
      alvos = await sqlServer.select("SELECT TOP (150) * FROM ALVO");
    }

    if (alvos) {
      alvos = alvos.map((item) => ({
        codAlvo: item.ALV_CODIGO,
        nomeAlvo: item.ALV_NOME,
        codCliente: item.ALV_CODCLN,
      }));
    } else {
      alvos = [];
    }

    return alvos;
  }
}

export default new AlvosService();
