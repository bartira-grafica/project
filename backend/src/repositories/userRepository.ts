import { PostgrestError } from "@supabase/supabase-js";
import supabase from "../server"; // Importação do cliente Supabase diretamente
import { User } from "../types/userTypes"; // Sugestão: criar um tipo `User` para os dados do usuário

// Função para criar um novo usuário no Supabase
export const createUser = async (
    userData: User
): Promise<{ data: any; error: PostgrestError | null }> => {
    try {
        // Agora, o cliente do Supabase já está disponível diretamente
        const { data, error } = await supabase.from("users").insert([
            {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role,
            },
        ]);

        return { data, error };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("id, email, password, role") // Seleciona os campos necessários
            .eq("email", email)
            .single(); // Garante que retorna apenas um usuário

        return { data, error };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};
