import { RowDataPacket } from "mysql2";
import { db } from "../server";
import { User } from "../types/userTypes";

// Função para criar um novo usuário no MySQL
export const createUser = async (userData: User) => {
    try {
        const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        const [result] = await db.execute(query, [
            userData.name,
            userData.email,
            userData.password,
            userData.role,
        ]);
        return { data: result, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};

// Função para listar todos os usuários
export const listUsers = async () => {
    try {
        const query = `SELECT * FROM users`;
        const [data] = await db.execute<RowDataPacket[]>(query);
        return { data, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};

// Função para obter um usuário pelo email
export const getUserByEmail = async (email: string) => {
    try {
        const query = `SELECT id, email, password, role FROM users WHERE email = ? LIMIT 1`;
        const [data] = await db.execute<RowDataPacket[]>(query, [email]);
        return { data: data.length ? data[0] : null, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};
