import sqlServer from "../database/sqlServer.js";

class ClientesService {
  async findClients(query) {
    let clientes = await sqlServer.select(
      "SELECT CLN_NOME, CLN_CODIGO, CLN_NUMERO FROM CLIENTE"
    );

    clientes = clientes.map((item) => ({
      codCliente: item.CLN_CODIGO,
      nomeCliente: item.CLN_NOME,
    }));

    return clientes;
  }
}

export default new ClientesService();
