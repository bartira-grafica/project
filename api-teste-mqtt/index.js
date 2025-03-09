// src/api/mqttApi.js

const express = require('express');
const mqtt = require('mqtt');

const app = express();
const port = 3001;

// Configuração do MQTT Broker
const MQTT_BROKER = "mqtt://test.mosquitto.org";
const client = mqtt.connect(MQTT_BROKER);

// Tópicos MQTT
const MQTT_TOPIC_CONTAGEM = "esteira/contagem";
const MQTT_TOPIC_FOLHAS_HORA = "esteira/contagem-folhas-hora";
const MQTT_TOPIC_TEMPO_FUNCIONAMENTO = "esteira/tempo-funcionamento";
const MQTT_TOPIC_DETECCAO = "esteira/deteccao";

// Conectar ao broker MQTT
client.on("connect", () => {
  console.log(`✅ Conectado ao MQTT Broker: ${MQTT_BROKER}`);
});

// Função auxiliar para publicar mensagens no broker MQTT
const publishMessage = (topic, payload) => {
  const message = JSON.stringify(payload);
  client.publish(topic, message, (err) => {
    if (err) {
      console.error("Erro ao publicar a mensagem:", err);
    } else {
      console.log(`📤 Mensagem enviada para ${topic}:`, message);
    }
  });
};

// Endpoint para enviar uma mensagem de contagem
app.post("/send-contagem", express.json(), (req, res) => {
  const { machineId, timestamp, contagem } = req.body;

  const payload = { id_esteira: machineId, timestamp, contagem };
  publishMessage(MQTT_TOPIC_CONTAGEM, payload);

  res.send("Mensagem de contagem enviada!");
});

// Endpoint para enviar uma mensagem de folhas por hora
app.post("/send-folhas-hora", express.json(), (req, res) => {
  const { machineId, timestamp, folhasHora } = req.body;

  const payload = { id_esteira: machineId, timestamp, "folhas-hora": folhasHora };
  publishMessage(MQTT_TOPIC_FOLHAS_HORA, payload);

  res.send("Mensagem de folhas por hora enviada!");
});

// Endpoint para enviar uma mensagem de tempo de funcionamento
app.post("/send-tempo-funcionamento", express.json(), (req, res) => {
  const { machineId, timestamp, tempoFuncionamento } = req.body;

  const payload = { id_esteira: machineId, timestamp, tempo_funcionando: tempoFuncionamento };
  publishMessage(MQTT_TOPIC_TEMPO_FUNCIONAMENTO, payload);

  res.send("Mensagem de tempo de funcionamento enviada!");
});

// Endpoint para enviar uma mensagem de detecção
app.post("/send-deteccao", express.json(), (req, res) => {
  const { machineId, timestamp, semDeteccao } = req.body;

  const payload = { id_esteira: machineId, timestamp, semDeteccao };
  publishMessage(MQTT_TOPIC_DETECCAO, payload);

  res.send("Mensagem de detecção enviada!");
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
