import { Request, Response } from "express";
import * as userRepository from "../repositories/userRepository";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateToken } from "../middlewares/jwtMiddleware";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || "";

export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: "Todos os campos são obrigatórios." });
        return;
    }

    try {
        const pwdEncrypted = await bcrypt.hash(password, 10);
        const { data: user, error } = await userRepository.getUserByEmail(
            email
        );

        if(user){
            res.status(400).json({ message: "Este email já esta cadastrado." });
            return;
        }
        
        const newUser = await userRepository.createUser({
            name,
            email,
            password: pwdEncrypted,
            role: role ?? "R",
        });

        if (newUser.error) {
            res.status(400).json({
                message: "Erro ao cadastrar usuário.",
                error: newUser.error,
            });
            return;
        }

        res.status(201).json({
            message: "Usuário cadastrado com sucesso.",
            user: newUser.data,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Erro interno no servidor.",
            error: error.message,
        });
    }
};


export const listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await userRepository.listUsers();
        res.status(200).json({ users });
    } catch (error: any) {
        res.status(500).json({
            message: "Erro interno no servidor.",
            error: error.message,
        });
    }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Todos os campos são obrigatórios." });
        return;
    }

    try {
        // Busca o usuário pelo e-mail
        const { data: user, error } = await userRepository.getUserByEmail(
            email
        );

        if (error || !user) {
            res.status(401).json({ message: "E-mail ou senha inválidos." });
            return;
        }

        // Verifica se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "E-mail ou senha inválidos." });
            return;
        }
        // Gera o token JWT
        const token = generateToken(user.id);

        res.status(200).json({
            message: "Login realizado com sucesso!",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Erro interno no servidor.",
            error: error.message,
        });
    }
};
