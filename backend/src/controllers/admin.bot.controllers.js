import BotData from "../models/BotData.model.js";

export const createBotData = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res
        .status(400)
        .json({ message: "Question and answer are required" });
    }

    const data = await BotData.create({ question, answer });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBotData = async (req, res) => {
  try {
    const data = await BotData.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateBotData = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const updated = await BotData.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBotData = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await BotData.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
