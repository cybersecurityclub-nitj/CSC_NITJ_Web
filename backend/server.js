import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

import { errorHandler } from "./middleware/errorMiddleware.js";

connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",       
      "http://localhost:3000",
    ],
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
