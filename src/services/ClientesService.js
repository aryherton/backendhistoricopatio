import sqlServer from "../database/sqlServer.js";

class ClientesService {
  async findClients(query) {
    const { codCliente, codUsuario } = query;

    let clientes = await sqlServer.select(
      `SELECT DISTINCT OPE.OPE_CODCLN AS CODIGO, CLN.CLN_NOME AS DESCRICAO, CLN.CLN_APELIDO AS APELIDO FROM USUARIOOPERACAO UO LEFT OUTER JOIN OPERACAO OPE ON UO.UO_CODOPE = OPE.OPE_CODIGO INNER JOIN CLIENTE CLN ON OPE.OPE_CODCLN = CLN.CLN_CODIGO WHERE UO.UO_CODUSR = ${codUsuario} AND UO.UO_ATIVO = 'S'`
    );

    clientes = clientes
      ? clientes.map((item) => ({
          codCliente: item.CODIGO,
          nomeCliente: item.DESCRICAO,
        }))
      : [];

    codCliente != 0
      ? (clientes = clientes.filter((client) => {
          return Number(client.codCliente) == Number(codCliente);
        }))
      : null;

    return clientes;
  }
}

export default new ClientesService();
