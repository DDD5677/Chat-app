import { Router } from "express";
import AuthController from "../controllers/auth.controller";
const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refresh);
router.get("/user", AuthController.getAuthorizedUser);

export default router;
