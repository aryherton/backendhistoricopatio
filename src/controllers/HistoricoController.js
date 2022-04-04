import HistoricoService from "../services/HistoricoService.js";

class HistoricoController {
  // Produtos

  async findHistory(req, res) {
    const { query } = req;
    const transportador = query.transportador ?? "";

    try {
      const data = await HistoricoService.findHistory(query);
      res.status(200);
      res.json(data);
      return;
    } catch (error) {
      res.status(500).send(error.message);
      return;
    }
  }
}

export default new HistoricoController();
