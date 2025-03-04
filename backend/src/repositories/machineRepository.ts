import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../server"; // Cliente Supabase
import { Machine } from "../types/machineTypes"; // Tipo para os dados da máquina

// Função para criar uma nova máquina no Supabase
export const createMachine = async (
    machineData: Machine
): Promise<{ data: any; error: PostgrestError | null }> => {
    try {
        // Agora, a função insere os dados na tabela 'machines' de acordo com a estrutura de MachineStatus
        const { data, error } = await supabase.from("machines").insert([
            {
                machine_id: machineData.machine_id,
                timestamp: machineData.timestamp,
                total_count: machineData.total_count,
                pages_last_hour: machineData.pages_last_hour,
                uptime: machineData.uptime,
                no_detection: machineData.no_detection,
            },
        ]);

        return { data, error };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};

export const listMachines = async (): Promise<{ data: Machine[] | null; error: PostgrestError | null }> => {
    try {
        const { data, error } = await supabase.from("machines").select("*");

        if (error) {
            return { data: null, error };
        }

        return { data, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};