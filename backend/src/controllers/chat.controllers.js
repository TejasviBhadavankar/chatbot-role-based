import Chat from "../models/Chat.model.js";
import BotData from "../models/BotData.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !conversationId) {
      return res.status(400).json({ message: "Message is required" });
    }

    const bot = await BotData.findOne({
      question: { $regex: message, $options: "i" },
    });

    const response = bot
      ? bot.answer
      : "Sorry, I don't understand.";

    const chat = await Chat.create({
      userId: req.user.id,
      conversationId,
      message,
      response,
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({
      createdAt: 1,
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    await Chat.deleteMany({ userId: req.user.id });
    res.json({ message: "Chat history deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
