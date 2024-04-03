import { Router } from "express";
import UserController from "../controllers/user.controller";
const router = Router();

router.get("/", UserController.getUsers);
router.get("/:id", UserController.getOneUser);

export default router;
