import mongoose from "mongoose";

const botDataSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BotData", botDataSchema);
