import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import userRoutes from "../routes/userRoutes";
import machinesRoutes from "../routes/machinesRoutes";
import * as mqttService from "../services/mqttService"; // Importando o mqttService

dotenv.config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || "3000", 10);

// Configuração do Supabase
const supabaseUrl: string = `https://${process.env.SUPABASE_URL}.supabase.co`;
const supabaseKey: string = process.env.SUPABASE_KEY || "";

// Inicializando o cliente do Supabase diretamente aqui
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

app.use(express.json()); // Middleware para parsear JSON
app.use("/users", userRoutes); // Define o prefixo de rota para usuários
app.use("/machines", machinesRoutes); // Define o prefixo de rota para máquinas

// Exportando o cliente Supabase para ser utilizado em outros arquivos
export { supabase };

// Chama o serviço MQTT para iniciar a escuta dos tópicos MQTT
mqttService; // Isso irá automaticamente se conectar ao broker e começar a ouvir as mensagens

if (process.env.NODE_ENV === "dev") {
  app.listen(port, () => {
    console.log(`Servidor rodando localmente na porta ${port}`);
  });
}

// A função de handler para a Vercel (exportação correta)
const handler = (req: Request, res: Response) => {
  app(req, res); // Chama o servidor Express para lidar com a requisição
};

export default handler;
