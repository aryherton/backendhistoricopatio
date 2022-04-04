import express from "express";

import HistoricoController from "./controllers/HistoricoController.js";
import ClientesController from "./controllers/ClientesController.js";
import AlvosController from "./controllers/AlvosController.js";
import OperacaoController from "./controllers/OperacaoController.js";

const routes = express.Router();

// Produtos
routes.get("/historico", HistoricoController.findHistory);
routes.get("/clientes", ClientesController.findClients);
routes.get("/operacoes", OperacaoController.findOperation);
routes.get("/alvos", AlvosController.findTarget);

export default routes;
