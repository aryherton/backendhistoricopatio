import OperacaoService from "../services/OperacaoService.js";

class OperacaoController {
  async findOperation(req, res) {
    const { query } = req;

    try {
      const data = await OperacaoService.findOperation(query);
      res.status(200);
      res.json(data);
      return;
    } catch (error) {
      res.status(500).send(error.message);
      return;
    }
  }
}

export default new OperacaoController();
