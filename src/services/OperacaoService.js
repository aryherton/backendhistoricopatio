import sqlServer from "../database/sqlServer.js";

class OperacaoService {
  async findOperation(query) {
    const { codCliente } = query;
    let operacao;

    if (codCliente) {
      operacao = await sqlServer.select(
        `SELECT OPE_CODIGO, OPE_NOME, OPE_CODCLN FROM OPERACAO WHERE OPE_CODCLN = ${codCliente}`
      );
    } else {
      operacao = await sqlServer.select(
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
