import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || "sua_chave_secreta";

export interface RequestWithUser extends Request {
  user?: any; // Você pode trocar `any` por `{ userId: string }` se quiser mais segurança
}

export const authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Pega o token removendo "Bearer "

  if (!token) {
    res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    return;
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };

    // Adiciona os dados do usuário ao request
    req.user = decoded;

    next();
  } catch (err) {
    res.status(403).json({ message: "Token inválido." });
    return;
  }
};

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
};
