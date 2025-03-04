import { Router } from "express";
import { registerUser,loginUser } from "../controllers/userController";

const router: Router = Router();

// Rota de cadastro de usuário
router.post("/register", registerUser);
router.get("/login", loginUser);

export default router;
