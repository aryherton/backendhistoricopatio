import mongoDb from "../database/mongoDb.js";
import sqlServer from "../database/sqlServer.js";

class HistoricoService {
  async findHistory(query) {
    let arrHistory = [];
    const { dataInicio, dataFim, cliente, operacao, codAlvo, placa, sm } =
      query;

    const initialDate = dataInicio
      ? new Date(
          new Date(
            dataInicio.substring(0, dataInicio.indexOf("T") + 1) +
              "00:00:00.000+03:00"
          ).setHours(24)
        )
      : "";
    const finalDate = dataFim
      ? new Date(
          new Date(
            dataFim.substring(0, dataFim.indexOf("T") + 1) +
              "23:59:59.999+03:00"
          ).setHours(23)
        )
      : "";

    let history = await mongoDb.find("client_alvos_vehicle_histories", {
      $and: [
        placa !== "" ? { plate: { $regex: placa } } : {},
        sm == "true" ? { cod_sm: { $exists: true, $not: { $lte: 0 } } } : {},
        codAlvo !== "" ? { cod_alvo: parseInt(codAlvo) } : {},
        { date_end_alvo: { $ne: null } },
        dataInicio !== "" && dataFim !== ""
          ? {
              date_init_alvo: {
                $gte: new Date(initialDate),
                $lte: new Date(finalDate),
              },
            }
          : {},
      ],
    });

    const getTimeInAlvo = (params) => {
      if (params) {
        let toHours = (params / 60).toFixed(2);
        let hours = toHours.toString().split(".")[0];
        let minutes = (toHours.toString().split(".")[1] * 60)
          .toString()
          .substring(0, 2);

        return `${hours}:${minutes}`;
      }
      return "";
    };

    for (const hist of history) {
      let alvo = await sqlServer.select(
        `SELECT ALV_NOME FROM ALVO WHERE ALV_CODIGO = ${hist.cod_alvo}`
      );
      alvo = alvo.length > 0 ? alvo[0].ALV_NOME : "ND";

      arrHistory.push({
        placa: hist.plate,
        frota: hist.plate,
        operacao: "ND",
        codAlvo: hist.cod_alvo,
        alvo: alvo,
        entradaAlvo: hist.date_init_alvo,
        saidaAlvo: hist.date_end_alvo,
        tempoEmAlvo: getTimeInAlvo(hist.time_in_alvo),
        tempoLimiteAlvo: "00:00",
        tempoExcedido: "00:00",
        sm: hist.cod_sm,
        tipoParada: hist.type,
        carreta: hist.plate,
        motorista: "JOAO DA SILVA",
        origem: "ORIGEM",
        destino: "DESTINO",
      });
    }

    return arrHistory;
  }
}

export default new HistoricoService();
