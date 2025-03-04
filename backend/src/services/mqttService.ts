// src/services/mqttService.ts

import { supabase } from "../server"; // Cliente Supabase
import mqtt from "mqtt"; // MQTT para se conectar ao broker

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

  try {
    switch (topic) {
      case MQTT_TOPIC_CONTAGEM:
        // Tópico de contagem de páginas
        const { contador, timestamp } = payload;
        await upsertMachineData(id_esteira, timestamp, contador, null, null, false);
        break;

      case MQTT_TOPIC_FOLHAS_HORA:
        // Tópico de folhas por hora
        const pagesLastHour = payload["folhas-hora"];
        await upsertMachineData(id_esteira, timestamp, null, pagesLastHour, null, false);
        break;

      case MQTT_TOPIC_TEMPO_FUNCIONAMENTO:
        // Tópico de tempo de funcionamento
        const uptime = payload["tempo_funcionando"];
        await upsertMachineData(id_esteira, timestamp, null, null, uptime, false);
        break;

      case MQTT_TOPIC_DETECCAO:
        // Tópico de detecção de movimento (se a esteira está parada ou em movimento)
        const noDetection = payload["semDeteccao"];
        await upsertMachineData(id_esteira, timestamp, null, null, null, noDetection);
        break;

      default:
        console.warn(`Tópico desconhecido: ${topic}`);
    }
  } catch (err) {
    console.error("❌ Erro ao processar a mensagem do MQTT:", err);
  }
});

// Função para atualizar ou inserir dados na tabela `machines`
async function upsertMachineData(
  machineId: string,
  timestamp: string | null,
  totalCount: number | null,
  pagesLastHour: number | null,
  uptime: number | null,
  noDetection: boolean | null
) {
  try {
    const { data, error } = await supabase.from("machines").upsert([
      {
        machine_id: machineId,  // Usando o ID da esteira
        timestamp: timestamp || null,  // Se não houver timestamp, será null
        total_count: totalCount || null,  // Se não houver contador, será null
        pages_last_hour: pagesLastHour || null,  // Se não houver páginas por hora, será null
        uptime: uptime || null,  // Se não houver tempo de funcionamento, será null
        no_detection: noDetection || false,  // Se não houver detecção, será false
      },
    ]);

    if (error) {
      console.error("Erro ao salvar os dados no banco:", error);
    } else {
      console.log("✅ Dados salvos com sucesso no banco de dados!", data);
    }
  } catch (err) {
    console.error("❌ Erro ao salvar os dados no banco:", err);
  }
}

// Exporta a função para ser utilizada em outro arquivo
module.exports = client;



//#region Código antigo
// import mqtt, { MqttClient } from "mqtt";
// import { SupabaseClient } from "@supabase/supabase-js";

// const MQTT_BROKER = "mqtt://test.mosquitto.org";
// const MQTT_TOPIC = "teste/esteira";

// // Função para iniciar o listener MQTT
// const startMqttListener = (supabase: SupabaseClient) => {
//   const client: MqttClient = mqtt.connect(MQTT_BROKER);

//   client.on("connect", () => {
//     console.log(`✅ Conectado ao MQTT Broker: ${MQTT_BROKER}`);

//     // Inscrever-se no tópico
//     client.subscribe(MQTT_TOPIC, (err) => {
//       if (err) {
//         console.error("Erro ao se inscrever no tópico:", err);
//       } else {
//         console.log(`📡 Inscrito no tópico: ${MQTT_TOPIC}`);
//       }
//     });

//     // Publicar dados a cada 10 segundos
//     setInterval(() => {
//       const dado = {
//         contador: Math.floor(Math.random() * 100),
//         timestamp: new Date().toISOString(), // Formatar timestamp como string ISO
//       };
//       const mensagem = JSON.stringify(dado);
//       client.publish(MQTT_TOPIC, mensagem);
//       console.log(`📤 Enviado para ${MQTT_TOPIC}:`, mensagem);
//     }, 10000);
//   });

//   // Listener para mensagens recebidas
//   client.on("message", async (topic: string, message: Buffer) => {
//     if (topic === MQTT_TOPIC) {
//       const payload = JSON.parse(message.toString());
//       console.log(`📥 Mensagem recebida: ${message.toString()}`);

//       try {
//         const { data, error } = await supabase
//           .from("Contador")
//           .insert([{ valor: payload.contador, created_at: payload.timestamp }]);

//         if (error) {
//           throw error;
//         }

//         console.log("✅ Dado salvo no PostgreSQL!");
//       } catch (err) {
//         console.error("❌ Erro ao salvar no banco:", err);
//       }
//     }
//   });
// };

// export { startMqttListener };


// src/services/mqttService.js
//#endregion