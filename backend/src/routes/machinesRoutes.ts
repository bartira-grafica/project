import { Router } from "express";
import { authenticateToken } from "../middlewares/jwtMiddleware";
import { listMachines, registerMachine } from "../controllers/machineController";

const router: Router = Router();

// Rota de cadastro de usuário
router.post("/register", authenticateToken, registerMachine);
router.get("/list", authenticateToken, listMachines);

export default router;
