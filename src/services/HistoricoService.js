import dayjs from "dayjs";
import mongoDb from "../database/mongoDb.js";
import sqlServer from "../database/sqlServer.js";
class HistoricoService {
  async findHistory(query) {
    let arrHistory = [];
    const {
      dataInicio,
      dataFim,
      codCliente,
      codOperacao,
      codAlvo,
      placa,
      sm,
      // page,
      // limit,
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

    const operacoes =
      codCliente && !codOperacao
        ? await sqlServer.selectConnect("SELECT OPE_CODIGO, OPE_CODCLN FROM OPERACAO")
        : "";

    const clientes =
      codCliente != 0 && !codOperacao
        ? operacoes.filter((item) => {
            return Number(item.OPE_CODCLN) == Number(codCliente);
          })
        : "";

    let history = await mongoDb.find(
      "client_alvos_vehicle_histories",
      // Number(page),
      // Number(limit),
      {
        $and: [
          placa !== "" ? { plate: { $regex: placa } } : {},
          sm == "true" ? { cod_sm: { $exists: true, $not: { $lte: 0 } } } : {},
          codAlvo !== "" ? { cod_alvo: Number(codAlvo) } : {},
          { date_end_alvo: { $ne: null } },
          { time_in_alvo: { $gte: 10 } },
          codOperacao !== "" ? { cod_op: Number(codOperacao) } : {},
          codCliente ? {cod_client: Number(codCliente)} : clientes ? {
            $or: clientes.map((operacao) => ({
              cod_op: Number(operacao.OPE_CODIGO),
            })),
          } : {},
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
        if (params >= 60) {
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
        } else {
          if (params > 9 && params < 60) {
            return `00:${parseInt(params)}`;
          } else if (params < 10 && params < 60) {
            return `00:0${parseInt(params)}`;
          }
        }
      }
      return "-";
    };

    const getExceededTime = (params) => {
      if (params?.time_in_alvo && params?.alv_tempo_parada) {
        let tempoEmAlvo = Number(params.time_in_alvo);
        let tempoLimiteAlvo = Number(params.alv_tempo_parada);
        let tempoExcedido = Math.abs(tempoLimiteAlvo - tempoEmAlvo);
        if (tempoExcedido > tempoLimiteAlvo) {
          tempoExcedido = getTimeInAlvo(tempoExcedido);
          return tempoExcedido;
        } else {
          return "00:00";
        }
      } else {
        return "00:00";
      }
    };

    for (const hist of history) {
      let entradaAlvo = hist?.date_init_alvo ? dayjs(hist.date_init_alvo) : '';
      let saidaAlvo = hist?.date_end_alvo ?? '';
      let tempoEmAlvo = dayjs(saidaAlvo).diff(entradaAlvo, 'minutes');
      let tempoLimiteAlvo = hist?.alv_tempo_parada ?? '';
      let tempoExcedido = tempoEmAlvo > tempoLimiteAlvo ? tempoEmAlvo - tempoLimiteAlvo : 0;

      arrHistory.push({
        placa: hist?.plate ?? "-",
        frota: hist?.num_frota ?? "-",
        operacao: hist?.cod_op ?? "-",
        codAlvo: hist?.cod_alvo ?? "-",
        alvo: hist?.alv_nome ?? "-",
        entradaAlvo: entradaAlvo,
        saidaAlvo: hist?.date_end_alvo ?? "-",
        tempoEmAlvo: getTimeInAlvo(tempoEmAlvo),
        tempoLimiteAlvo: hist?.alv_tempo_parada
          ? getTimeInAlvo(hist?.alv_tempo_parada)
          : "00:00",
        tempoExcedido: getTimeInAlvo(tempoExcedido),
        sm: hist?.cod_sm ?? "-",
        tipoParada: hist?.type ?? "-",
        carreta: hist?.plate ?? "-",
        motorista: hist?.motorista ?? "-",
        origem: hist?.cod_sm ? hist?.alvo_origem?.alv_nome ?? "-" : "-",
        destino: hist?.cod_sm ? hist?.alvo_destino?.alv_nome ?? "-" : "-",
      });
    }

    return arrHistory;
  }
}

export default new HistoricoService();
