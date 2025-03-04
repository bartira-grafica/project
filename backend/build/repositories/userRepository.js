"use strict";Object.defineProperty(exports, "__esModule", {value: true});
var _server = require('../server'); // Agora você importa corretamente o cliente Supabase
 // Sugestão: criar um tipo `User` para os dados do usuário

// Função para criar um novo usuário no Supabase
 const createUser = async (
    userData
) => {
    try {
        // Agora, o cliente do Supabase já está disponível diretamente
        const { data, error } = await _server.supabase.from("users").insert([
            {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role,
            },
        ]);

        return { data, error };
    } catch (error) {
        return { data: null, error: error.message };
    }
}; exports.createUser = createUser;

 const listUsers = async () => {
    try {
        const { data, error } = await _server.supabase
            .from("users")
            .select("*");

        return { data, error };
    } catch (error) {
        return { data: null, error: error.message };
    }
}; exports.listUsers = listUsers

 const getUserByEmail = async (email) => {
    try {
        const { data, error } = await _server.supabase
            .from("users")
            .select("id, email, password, role") // Seleciona os campos necessários
            .eq("email", email)
            .single(); // Garante que retorna apenas um usuário

        return { data, error };
    } catch (error) {
        return { data: null, error: error.message };
    }
}; exports.getUserByEmail = getUserByEmail;
