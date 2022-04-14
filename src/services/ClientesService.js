import sqlServer from "../database/sqlServer.js";

class ClientesService {
  async findClients(query) {
    const { codUsuario } = query;

    let clientes = await sqlServer.select(
      // `SELECT CLN_NOME, CLN_CODIGO, CLN_NUMERO FROM CLIENTE WHERE CLN_CODUSR = ${codUsuario}`
      `SELECT DISTINCT OPE.OPE_CODCLN AS CODIGO, CLN.CLN_NOME AS DESCRICAO, CLN.CLN_APELIDO AS APELIDO FROM USUARIOOPERACAO UO LEFT OUTER JOIN OPERACAO OPE ON UO.UO_CODOPE = OPE.OPE_CODIGO INNER JOIN CLIENTE CLN ON OPE.OPE_CODCLN = CLN.CLN_CODIGO WHERE UO.UO_CODUSR = ${codUsuario} AND UO.UO_ATIVO = 'S'`
    );

    clientes = clientes
      ? clientes.map((item) => ({
          codCliente: item.CODIGO,
          nomeCliente: item.DESCRICAO,
        }))
      : [];

    return clientes;
  }
}

export default new ClientesService();
