import AlvosService from "../services/AlvosService.js";

class AlvosController {
  async findTarget(req, res) {
    const { query } = req;

    try {
      const data = await AlvosService.findTarget(query);
      res.status(200);
      res.json(data);
      return;
    } catch (error) {
      res.status(500).send(error.message);
      return;
    }
  }
}

export default new AlvosController();
