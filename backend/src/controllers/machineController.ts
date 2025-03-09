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

// Função para atualizar o machine_id de uma máquina
export const updateMachineId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { machine_id, prev_machine_id } = req.body;

    // Verifica se o machine_id foi enviado
    if (!machine_id) {
        res.status(400).json({ message: "O campo 'machine_id' é obrigatório." });
        return;
    }

    if (!prev_machine_id) {
        res.status(400).json({ message: "O campo 'prev_machine_id' é obrigatório." });
        return;
    }

    try {
        // Atualiza o registro de máquina
        const updatedMachine = await machineRepository.updateMachineId(prev_machine_id, machine_id);

        // Verifica se houve erro ao atualizar o registro
        if (updatedMachine.error) {
            res.status(400).json({
                message: "Erro ao atualizar máquina.",
                error: updatedMachine.error,
            });
            return;
        }

        // Retorna a resposta de sucesso
        res.status(201).json({
            message: "Máquina atualizada com sucesso.",
            machine: updatedMachine.data,
        });
    } catch (error: any) {
        res.status(500).json({
            message: "Erro interno no servidor.",
            error: error.message,
        });
    }
};

// Função para deletar uma máquina
export const deleteMachineId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { machine_id } = req.params;

    // Verifica se o machine_id foi enviado
    if (!machine_id) {
        res.status(400).json({ message: "O campo 'machine_id' é obrigatório." });
        return;
    }
    try {
        // Deleta o registro de máquina
        const deleteddMachine = await machineRepository.deleteMachine(machine_id);

        // Verifica se houve erro ao deletar o registro
        if (deleteddMachine.error) {
            res.status(400).json({
                message: "Erro ao deletar máquina.",
                error: deleteddMachine.error,
            });
            return;
        }

        // Retorna a resposta de sucesso
        res.status(201).json({
            message: "Máquina deletada com sucesso.",
            machine: deleteddMachine.data,
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