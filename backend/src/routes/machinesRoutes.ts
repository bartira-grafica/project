import { Router } from "express";
import { authenticateToken } from "../middlewares/jwtMiddleware";
import { listMachines, registerMachine, updateMachineId, deleteMachineId } from "../controllers/machineController";

const router: Router = Router();

// Rota de cadastro de usuário
router.post("/register", authenticateToken, registerMachine);
router.post("/update", authenticateToken, updateMachineId);
router.post("/delete/:machine_id", authenticateToken, deleteMachineId);
router.get("/list", authenticateToken, listMachines);

export default router;
