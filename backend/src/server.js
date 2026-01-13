import dotenv from "dotenv";
dotenv.config();
import express from "express";
import app from "./app.js";
import connectDB from "./config/db.js";
import path from "path";
connectDB();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
