import { db } from "../server";
import { Machine } from "../types/machineTypes";

export const createMachine = async (
    machineData: Machine
): Promise<{ data: any; error: string | null }> => {
    try {
        const query = `INSERT INTO machines (machine_id, timestamp, total_count, pages_last_hour, uptime, no_detection) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            machineData.machine_id,
            machineData.timestamp,
            machineData.total_count,
            machineData.pages_last_hour,
            machineData.uptime,
            machineData.no_detection,
        ];

        const [result] = await db.execute(query, values);
        return { data: result, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};

export const updateMachineId = async (
    prevMachineId: string,
    machineId: string
): Promise<{ data: any; error: string | null }> => {
    try {
        const query = `UPDATE machines SET machine_id = ? WHERE machine_id = ?`;
        const [result] = await db.execute(query, [machineId, prevMachineId]);
        return { data: result, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};

export const deleteMachine = async (
    machineId: string
): Promise<{ data: any; error: string | null }> => {
    try {
        const query = `DELETE FROM machines WHERE machine_id = ?`;
        const [result] = await db.execute(query, [machineId]);
        return { data: result, error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};

export const listMachines = async (): Promise<{ data: Machine[] | null; error: string | null }> => {
    try {
        const query = `SELECT * FROM machines`;
        const [rows] = await db.execute(query);
        return { data: rows as Machine[], error: null };
    } catch (error: any) {
        return { data: null, error: error.message };
    }
};
