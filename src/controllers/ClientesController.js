import ClientesService from "../services/ClientesService.js";

class ClientesController {
  async findClients(req, res) {
    const { query } = req;

    try {
      const data = await ClientesService.findClients(query);
      res.status(200);
      res.json(data);
      return;
    } catch (error) {
      res.status(500).send(error.message);
      return;
    }
  }
}

export default new ClientesController();
