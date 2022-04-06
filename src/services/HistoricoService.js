import mongoDb from "../database/mongoDb.js";

class HistoricoService {
  async findHistory(query) {
    let arrHistory = [];
    const {
      dataInicio,
      dataFim,
      cliente,
      codOperacao,
      codAlvo,
      placa,
      sm,
      page,
      limit,
    } = query;

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

    let history = await mongoDb.paginatedFind(
      "client_alvos_vehicle_histories",
      Number(page),
      Number(limit),
      {
        $and: [
          placa !== "" ? { plate: { $regex: placa } } : {},
          sm == "true" ? { cod_sm: { $exists: true, $not: { $lte: 0 } } } : {},
          codAlvo !== "" ? { cod_alvo: Number(codAlvo) } : {},
          { date_end_alvo: { $ne: null } },
          codOperacao !== "" ? { cod_op: Number(codOperacao) } : {},
          dataInicio !== "" && dataFim !== ""
            ? {
                date_init_alvo: {
                  $gte: new Date(initialDate),
                  $lte: new Date(finalDate),
                },
              }
            : {},
        ],
      }
    );

    const getTimeInAlvo = (params) => {
      if (params) {
        let toHours = (params / 60).toFixed(2);
        let hours = toHours.toString().split(".")[0];
        if (hours < 10) {
          hours = `0${hours}`;
        }
        let minutes = (toHours.toString().split(".")[1] * 60)
          .toString()
          .substring(0, 2);
        if (minutes >= 60) {
          minutes = `0${minutes.substring(0, 1)}`;
        }
        if (minutes == 0) {
          minutes = "00";
        }

        return `${hours}:${minutes}`;
      }
      return "";
    };

    for (const hist of history) {
      arrHistory.push({
        placa: hist?.plate ?? "-",
        frota: hist?.num_frota ?? "-",
        operacao: hist?.cod_op ?? "-",
        codAlvo: hist?.cod_alvo ?? "-",
        alvo: hist?.alv_nome ?? "-",
        entradaAlvo: hist?.date_init_alvo ?? "-",
        saidaAlvo: hist?.date_end_alvo ?? "-",
        tempoEmAlvo: getTimeInAlvo(hist?.time_in_alvo),
        tempoLimiteAlvo: "00:00",
        tempoExcedido: "00:00",
        sm: hist?.cod_sm ?? "-",
        tipoParada: hist?.type ?? "-",
        carreta: hist?.plate ?? "-",
        motorista: "JOAO DA SILVA",
        origem: hist?.cod_sm ? hist?.alvo_origem?.alv_nome ?? "-" : "-",
        destino: hist?.cod_sm ? hist?.alvo_destino?.alv_nome ?? "-" : "-",
      });
    }

    return arrHistory;
  }
}

export default new HistoricoService();
