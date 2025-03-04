// // Importa as dependências
// require("dotenv").config(); // Carrega as variáveis do .env
// const express = require("express"); // Express para criar o servidor
// const { createClient } = require("@supabase/supabase-js"); // Cliente do Supabase
// const mqtt = require("mqtt");

// // Cria o app do Express
// const app = express();
// const port = process.env.PORT || 3000;

// // Cria a string de conexão com o Supabase
// const supabaseUrl = `https://${process.env.SUPABASE_URL}.supabase.co`;
// const supabaseKey = process.env.SUPABASE_KEY;

// // Cria o cliente do Supabase
// const supabase = createClient(supabaseUrl, supabaseKey);

// //#region Configuração MQTT Broker
// const MQTT_BROKER = "mqtt://test.mosquitto.org";
// const MQTT_TOPIC = "teste/esteira";

// const client = mqtt.connect(MQTT_BROKER);
// //#endregion

// //#region Abertura de conexão com broker
// client.on("connect", () => {
//   console.log(`✅ Conectado ao MQTT Broker: ${MQTT_BROKER}`);

//   // Inscrever no tópico
//   client.subscribe(MQTT_TOPIC, (err) => {
//     if (err) console.error("Erro ao se inscrever no tópico:", err);
//     else console.log(`📡 Inscrito no tópico: ${MQTT_TOPIC}`);
//   });

//   // Publicar dados a cada 10 segundos
//   setInterval(() => {
//     const dado = {
//       contador: Math.floor(Math.random() * 100),
//       timestamp: new Date(),
//     };
//     const mensagem = JSON.stringify(dado);
//     client.publish(MQTT_TOPIC, mensagem);
//     console.log(`📤 Enviado para ${MQTT_TOPIC}:`, mensagem);
//   }, 10000);
// });
// //#endregion

// //#region Listener do broker
// client.on("message", async (topic, message) => {
//   if (topic === MQTT_TOPIC) {
//     const payload = JSON.parse(message);
//     console.log(`📥 Mensagem recebida: ${message.toString()}`);

//     try {
//       // Correção: Capturar `error` explicitamente
//       const { data, error } = await supabase
//         .from("Contador")
//         .insert([{ valor: payload.contador, created_at: payload.timestamp }]); // Correção: objeto dentro de um array

//       if (error) {
//         throw error; // Lança erro se existir
//       }

//       console.log("✅ Dado salvo no PostgreSQL!");
//     } catch (err) {
//       console.error("❌ Erro ao salvar no banco:", err);
//     }
//   }
// });
// //#endregion

// // Rota para buscar usuários da tabela "users"
// app.get("/users", async (req, res) => {
//   try {
//     // Faz a consulta para buscar todos os usuários
//     const { data, error } = await supabase
//       .from("users") // Adicionando o schema 'public'
//       .select("");

//     // Verifica se houve erro na consulta
//     if (error) {
//       return res
//         .status(400)
//         .json({ message: "Erro ao buscar usuários", error: error.message });
//     }

//     // Retorna os dados em formato JSON
//     res.json(data);
//   } catch (err) {
//     // Em caso de erro na execução da função
//     res.status(500).json({ message: "Erro interno", error: err.message });
//   }
// });

// // Inicia o servidor
// app.listen(port, () => {
//   console.log(`Servidor rodando na porta ${port}`);
// });
