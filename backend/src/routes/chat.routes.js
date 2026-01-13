import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  sendMessage,
  getHistory,
  deleteHistory,
} from "../controllers/chat.controllers.js";

const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/history", auth, getHistory);
router.delete("/history", auth, deleteHistory);

export default router;
