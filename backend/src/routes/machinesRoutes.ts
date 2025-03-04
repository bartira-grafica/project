import { Router } from "express";
import { authenticateToken } from "../middlewares/jwtMiddleware";
import { registerMachine } from "../controllers/machineController";

const router: Router = Router();

// Rota de cadastro de usuário
router.get("/register", authenticateToken, registerMachine);

export default router;
