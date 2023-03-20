import express from "express";

import HistoricoController from "./controllers/HistoricoController.js";
import ClientesController from "./controllers/ClientesController.js";
import AlvosController from "./controllers/AlvosController.js";
import OperacaoController from "./controllers/OperacaoController.js";
import { checkApiKey } from "./middleware/checkApiKey.js";

const routes = express.Router();

routes.get("/historico-patio", (req, res) => {
  res.send("Api Histórico Patio Online!");
});

routes.use(checkApiKey);

routes.get("/historico-patio/clientes", ClientesController.findClients);
routes.get("/historico-patio/operacoes", OperacaoController.findOperation);
routes.get("/historico-patio/alvos", AlvosController.findTarget);
routes.get("/historico-patio/historico", HistoricoController.findHistory);

export default routes;
