import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },
    message: String,
    response: String,
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
