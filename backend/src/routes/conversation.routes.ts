import { Router } from "express";
import ConversationController from "../controllers/conversation.controller";
const router = Router();

router.get("/", ConversationController.getConversation);
router.get("/:id", ConversationController.getOneConversation);
router.post("/", ConversationController.createConversation);

export default router;
