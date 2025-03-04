import { Router } from "express";
import { registerUser,loginUser, listUsers } from "../controllers/userController";
import { authenticateToken } from "../middlewares/jwtMiddleware";

const router: Router = Router();

// Rota de cadastro de usuário
router.post("/register", registerUser);
router.get("/login", loginUser);
router.get("/list", authenticateToken, listUsers);

export default router;
