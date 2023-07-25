import sqlServer from "../database/sqlServer.js";

class OperacaoService {
  async findOperation(query) {
    const { codCliente } = query;
    let codUsuario = query.codUsuario ?? '';

    if (codUsuario) {
      let usuarioBr = await sqlServer.selectBr(`SELECT USR_CPF AS CPF FROM USUARIO WHERE USR_CODIGO = ${codUsuario}`)
      let cpfUsuario = '';
      if (usuarioBr?.length > 0) cpfUsuario = usuarioBr[0].CPF;
  
      let usuarioConnect = await sqlServer.selectConnect(`SELECT USR_CODIGO AS CODIGO FROM USUARIO WHERE USR_CPF = '${cpfUsuario}'`)
      if (usuarioConnect?.length > 0) codUsuario = usuarioConnect[0].CODIGO;
    }

    let operacao;
    let operacoesId;

    if (codUsuario) {
      operacoesId = await sqlServer.selectConnect(
        `SELECT UO_CODOPE, UO_CODUSR FROM USUARIOOPERACAO WHERE UO_CODUSR = ${codUsuario} AND UO_ATIVO = 'S'`
      );
      operacoesId = operacoesId?.map((ope)=> ope.UO_CODOPE);
      operacao = await sqlServer.selectConnect(
        "SELECT OPE_CODIGO, OPE_NOME, OPE_CODCLN FROM OPERACAO"
      );
      operacao = operacao.filter((ope)=> operacoesId.includes(ope.OPE_CODIGO))
    } else if (codCliente) {
      operacao = await sqlServer.selectConnect(
        `SELECT OPE_CODIGO, OPE_NOME, OPE_CODCLN FROM OPERACAO WHERE OPE_CODCLN = ${codCliente}`
      );
    } else {
      operacao = await sqlServer.selectConnect(
        "SELECT OPE_CODIGO, OPE_NOME, OPE_CODCLN FROM OPERACAO"
      );
    }

    operacao = operacao.map((item) => ({
      codOperacao: item.OPE_CODIGO,
      nomeOperacao: item.OPE_NOME,
      codCliente: item.OPE_CODCLN,
    }));

    return operacao;
  }
}

export default new OperacaoService();
