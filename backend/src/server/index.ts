import dotenv from "dotenv";
import express, { Application } from "express";
import mysql from "mysql2/promise";
import userRoutes from "../routes/userRoutes";
import machinesRoutes from "../routes/machinesRoutes";
import * as mqttService from "../services/mqttService"; // Importando o mqttService
import cors from "cors"; // Importando o pacote CORS

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || "3000", 10);

// Configuração do MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Middleware para CORS
app.use(cors()); // Ativando o CORS para todas as rotas

app.use(express.json()); // Middleware para parsear JSON
app.use("/users", userRoutes); // Define o prefixo de rota para usuários
app.use("/machines", machinesRoutes); // Define o prefixo de rota para máquinas

// Exportando o cliente MySQL para ser utilizado em outros arquivos
export { db };

// Chama o serviço MQTT para iniciar a escuta dos tópicos MQTT
mqttService; // Isso irá automaticamente se conectar ao broker e começar a ouvir as mensagens

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log(`Servidor rodando localmente na porta ${port}`);
  });
}

// A função de handler para a Vercel (exportação correta)
export default app;
