import sqlServer from "../database/sqlServer.js";

class ClientesService {
  async findClients(query) {
    const { codCliente, codUsuario } = query;

    console.log(new Date().toISOString())

    // console.log('codCliente: ', codCliente);
    // console.log('codUsuario: ', codUsuario);

    let usuarioBr = await sqlServer.selectBr(`SELECT USR_CPF AS CPF FROM USUARIO WHERE USR_CODIGO = ${codUsuario}`)
    let cpfUsuario = '';
    if (usuarioBr?.length > 0) cpfUsuario = usuarioBr[0].CPF;

    // console.log('cpfUsuario: ', cpfUsuario);

    let usuarioConnect = await sqlServer.selectConnect(`SELECT USR_CODIGO AS CODIGO FROM USUARIO WHERE USR_CPF = '${cpfUsuario}'`)
    let codUsuarioConnect = '';
    if (usuarioConnect?.length > 0) codUsuarioConnect = usuarioConnect[0].CODIGO;

    // console.log('codUsuarioConnect: ', codUsuarioConnect);

    let clientes = await sqlServer.selectConnect(
      `SELECT DISTINCT OPE.OPE_CODCLN AS CODIGO, CLN.CLN_NOME AS DESCRICAO, CLN.CLN_APELIDO AS APELIDO FROM USUARIOOPERACAO UO LEFT OUTER JOIN OPERACAO OPE ON UO.UO_CODOPE = OPE.OPE_CODIGO INNER JOIN CLIENTE CLN ON OPE.OPE_CODCLN = CLN.CLN_CODIGO WHERE UO.UO_CODUSR = ${codUsuarioConnect} AND UO.UO_ATIVO = 'S'`
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
