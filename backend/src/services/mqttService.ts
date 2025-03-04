import mqtt, { MqttClient } from "mqtt";
import { SupabaseClient } from "@supabase/supabase-js";

const MQTT_BROKER = "mqtt://test.mosquitto.org";
const MQTT_TOPIC = "teste/esteira";

// Função para iniciar o listener MQTT
const startMqttListener = (supabase: SupabaseClient) => {
  const client: MqttClient = mqtt.connect(MQTT_BROKER);

  client.on("connect", () => {
    console.log(`✅ Conectado ao MQTT Broker: ${MQTT_BROKER}`);

    // Inscrever-se no tópico
    client.subscribe(MQTT_TOPIC, (err) => {
      if (err) {
        console.error("Erro ao se inscrever no tópico:", err);
      } else {
        console.log(`📡 Inscrito no tópico: ${MQTT_TOPIC}`);
      }
    });

    // Publicar dados a cada 10 segundos
    setInterval(() => {
      const dado = {
        contador: Math.floor(Math.random() * 100),
        timestamp: new Date().toISOString(), // Formatar timestamp como string ISO
      };
      const mensagem = JSON.stringify(dado);
      client.publish(MQTT_TOPIC, mensagem);
      console.log(`📤 Enviado para ${MQTT_TOPIC}:`, mensagem);
    }, 10000);
  });

  // Listener para mensagens recebidas
  client.on("message", async (topic: string, message: Buffer) => {
    if (topic === MQTT_TOPIC) {
      const payload = JSON.parse(message.toString());
      console.log(`📥 Mensagem recebida: ${message.toString()}`);

      try {
        const { data, error } = await supabase
          .from("Contador")
          .insert([{ valor: payload.contador, created_at: payload.timestamp }]);

        if (error) {
          throw error;
        }

        console.log("✅ Dado salvo no PostgreSQL!");
      } catch (err) {
        console.error("❌ Erro ao salvar no banco:", err);
      }
    }
  });
};

export { startMqttListener };
