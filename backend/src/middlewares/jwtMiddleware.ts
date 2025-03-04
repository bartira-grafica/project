import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Defina sua chave secreta (o ideal é usar variáveis de ambiente)
const SECRET_KEY = "sua_chave_secreta";

// Middleware para verificar o JWT

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }
  
    try {
      // Verifica e decodifica o token
      const decoded = jwt.verify(token, SECRET_KEY);
  
      // Adiciona os dados do usuário dentro de req.body
      req.body.user = decoded;
  
      next();
    } catch (err) {
      return res.status(403).json({ message: "Token inválido." });
    }
  };

export const generateToken = (userId: string) => {
    const SECRET_KEY = "sua_chave_secreta";
  
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
  
    return token;
  };
