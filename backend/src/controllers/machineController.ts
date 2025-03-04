import { Request, Response } from "express";
import * as machineRepository from "../repositories/machineRepository"; // Repositório para máquina

// Função para registrar uma máquina com apenas o machine_id
export const registerMachine = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { machine_id } = req.body;

    // Verifica se o machine_id foi enviado
    if (!machine_id) {
        res.status(400).json({ message: "O campo 'machine_id' é obrigatório." });
        return;
    }

    try {
        // Criando o novo registro de máquina, com campos nulos ou valores padrão
        const newMachine = await machineRepository.createMachine({
            machine_id,
            timestamp: null,            // Inicializa como null
            total_count: null,         // Inicializa como null
            pages_last_hour: null,     // Inicializa como null
            uptime: null,              // Inicializa como null
            no_detection: null         // Inicializa como null
        });

        // Verifica se houve erro ao criar o registro
        if (newMachine.error) {
            res.status(400).json({
                message: "Erro ao registrar máquina.",
                error: newMachine.error,
            });
            return;
        }

        // Retorna a resposta de sucesso
        res.status(201).json({
            message: "Máquina registrada com sucesso.",
            machine: newMachine.data,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Erro interno no servidor.",
            error: error.message,
        });
    }
};

export const listMachines = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Chama a função do repositório que lista todas as máquinas
        const { data, error } = await machineRepository.listMachines();

        // Verifica se houve erro ao listar as máquinas
        if (error) {
            res.status(400).json({
                message: "Erro ao listar máquinas.",
                error: error,
            });
            return;
        }

        // Retorna as máquinas
        res.status(200).json(data);
    } catch (error: any) {
        res.status(500).json({
            message: "Erro interno no servidor.",
            error: error.message,
        });
    }
};