import express from "express";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";
import {
  createBotData,
  getBotData,
  updateBotData,
  deleteBotData,
} from "../controllers/admin.bot.controllers.js";

const router = express.Router();

router.use(auth, role("admin"));

router.post("/", createBotData);
router.get("/", getBotData);
router.put("/:id", updateBotData);
router.delete("/:id", deleteBotData);

export default router;
