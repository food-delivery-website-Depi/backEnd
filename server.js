import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
// import mongoose from "mongoose";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// import { register } from "./src/controllers/auth.js";
// import { createPost } from "./src/controllers/posts.js";
// import { verifyToken } from "./src/middleware/auth.js";

// app config
const app = express();
const port = 4000;

// middlewares
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Api is working well!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// mongodb+srv://mahmoudhossam219200:Khodary12345@cluster0.a0qzr.mongodb.net/?
