// src/services/mqttService.ts

import mqtt from "mqtt"; // MQTT para se conectar ao broker
import { db } from "../server"; // Importa a conexão com o banco de dados
import { Machine } from "../types/machineTypes";

// Configuração do MQTT Broker
const MQTT_BROKER = "mqtt://test.mosquitto.org";
const MQTT_TOPIC_CONTAGEM = "esteira/contagem"; // Tópico de contagem
const MQTT_TOPIC_FOLHAS_HORA = "esteira/contagem-folhas-hora"; // Tópico de folhas por hora
const MQTT_TOPIC_TEMPO_FUNCIONAMENTO = "esteira/tempo-funcionamento"; // Tópico de tempo de funcionamento
const MQTT_TOPIC_DETECCAO = "esteira/deteccao"; // Tópico de detecção (se a esteira está parada ou em movimento)

// Conecta ao broker MQTT
const client = mqtt.connect(MQTT_BROKER);

// Abertura de conexão com o broker
client.on("connect", () => {
  console.log(`✅ Conectado ao MQTT Broker: ${MQTT_BROKER}`);

  // Inscrever nos tópicos
  client.subscribe([MQTT_TOPIC_CONTAGEM, MQTT_TOPIC_FOLHAS_HORA, MQTT_TOPIC_TEMPO_FUNCIONAMENTO, MQTT_TOPIC_DETECCAO], (err: any) => {
    if (err) {
      console.error("Erro ao se inscrever nos tópicos:", err);
    } else {
      console.log(`📡 Inscrito nos tópicos: ${MQTT_TOPIC_CONTAGEM}, ${MQTT_TOPIC_FOLHAS_HORA}, ${MQTT_TOPIC_TEMPO_FUNCIONAMENTO}, ${MQTT_TOPIC_DETECCAO}`);
    }
  });
});

// Listener do broker - Recebe mensagens do tópico MQTT
client.on("message", async (topic: string, message: Buffer) => {
  const payload = JSON.parse(message.toString());
  console.log(`📥 Mensagem recebida no tópico "${topic}": ${message.toString()}`);

  const id_esteira = payload.id_esteira || "default_esteira_id"; // Obter o id_esteira do payload
  const { timestamp } = payload;

  try {
    switch (topic) {
      case MQTT_TOPIC_CONTAGEM:
        // Tópico de contagem de páginas
        const contagem = payload["contagem"];
        console.log("contagem: ", contagem);

        await updateTotalCount(id_esteira, timestamp, contagem);
        break;

      case MQTT_TOPIC_FOLHAS_HORA:
        // Tópico de folhas por hora
        const pagesLastHour = payload["folhas-hora"];
        await updatePagesLastHour(id_esteira, timestamp, pagesLastHour);
        break;

      case MQTT_TOPIC_TEMPO_FUNCIONAMENTO:
        // Tópico de tempo de funcionamento
        const uptime = payload["tempo_funcionando"];
        await updateUptime(id_esteira, timestamp, uptime);
        break;

      case MQTT_TOPIC_DETECCAO:
        // Tópico de detecção de movimento (se a esteira está parada ou em movimento)
        const noDetection = payload["semDeteccao"];
        await updateNoDetection(id_esteira, timestamp, noDetection);
        break;

      default:
        console.warn(`Tópico desconhecido: ${topic}`);
    }
  } catch (err) {
    console.error("❌ Erro ao processar a mensagem do MQTT:", err);
  }
});

// Função para atualizar o total_count somando o novo valor ao valor existente
async function updateTotalCount(machineId: string, timestamp: number, totalCount: number | null) {
  try {
    const query = `
      UPDATE machines 
      SET total_count = IFNULL(total_count, 0) + ?, timestamp = ?
      WHERE machine_id = ?;
    `;
    const values = [totalCount, timestamp, machineId];

    // Executa a query de atualização no banco de dados
    await db.execute(query, values);

    console.log(`✅ Dados atualizados no banco para o machine_id: ${machineId}, total_count somado: ${totalCount}, timestamp: ${timestamp}`);
  } catch (err) {
    console.error("❌ Erro ao atualizar os dados no banco:", err);
  }
}

// Função para atualizar o pages_last_hour
async function updatePagesLastHour(machineId: string, timestamp: number, pagesLastHour: number | null) {
  try {
    const query = `
      UPDATE machines 
      SET pages_last_hour = ?, timestamp = ?
      WHERE machine_id = ?;
    `;
    const values = [pagesLastHour, timestamp, machineId];

    // Executa a query de atualização no banco de dados
    await db.execute(query, values);

    console.log(`✅ Dados atualizados no banco para o machine_id: ${machineId}, pages_last_hour: ${pagesLastHour}, timestamp: ${timestamp}`);
  } catch (err) {
    console.error("❌ Erro ao atualizar os dados no banco:", err);
  }
}

// Função para atualizar o uptime e timestamp, somando o uptime caso já exista um valor
async function updateUptime(machineId: string, timestamp: number, uptime: number | null) {
  try {
    // Primeiro, pega o uptime atual da máquina
    const [rows] = await db.execute(
      `SELECT uptime FROM machines WHERE machine_id = ?`,
      [machineId]
    );

    const machine = (rows as Machine[])[0];

    // Verifica se algum dado foi retornado
    if (!machine) {
      console.warn(`⚠️ Nenhum dado encontrado para a máquina com id ${machineId}`);
      return; // Se não encontrou dados, retorna sem fazer nada
    }

    const currentUptime = machine?.uptime || 0; // Se não houver uptime, assume como 0

    // Somar o uptime novo com o existente, se o valor do uptime atual não for nulo
    const newUptime = Number(currentUptime) + Number(uptime || 0); 

    // Query para atualizar o uptime e timestamp
    const query = `
      UPDATE machines
      SET uptime = ?, timestamp = ?
      WHERE machine_id = ?;
    `;
    const values = [newUptime, timestamp, machineId];

    // Executa a query de atualização no banco de dados
    await db.execute(query, values);

    console.log(`✅ Dados atualizados no banco para o machine_id: ${machineId}, uptime: ${newUptime}, timestamp: ${timestamp}`);
  } catch (err) {
    console.error("❌ Erro ao atualizar os dados no banco:", err);
  }
}

// Função para atualizar o campo no_detection e, se semDeteccao for true, atualizar o uptime para 0
async function updateNoDetection(machineId: string, timestamp: number, semDeteccao: boolean) {
  try {
    // Verifica se o uptime deve ser alterado
    let updateQuery: string;
    let values: any[];

    if (semDeteccao) {
      // Se semDeteccao for true, o uptime vai para 0
      updateQuery = `
        UPDATE machines
        SET no_detection = ?, timestamp = ?, uptime = 0
        WHERE machine_id = ?;
      `;
      values = [semDeteccao, timestamp, machineId];
    } else {
      // Se semDeteccao for false, apenas o no_detection é alterado
      updateQuery = `
        UPDATE machines
        SET no_detection = ?, timestamp = ?
        WHERE machine_id = ?;
      `;
      values = [semDeteccao, timestamp, machineId];
    }

    // Executa a query de atualização
    await db.execute(updateQuery, values);

    console.log(`✅ Dados atualizados no banco para o machine_id: ${machineId}, no_detection: ${semDeteccao}, timestamp: ${timestamp}`);
  } catch (err) {
    console.error("❌ Erro ao atualizar os dados no banco:", err);
  }
}

// Exporta a função para ser utilizada em outro arquivo
module.exports = client;
  