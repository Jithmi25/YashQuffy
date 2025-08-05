import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from 'fs'

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import auth from "./middleware/auth.js";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api/auth", authRoutes);
app.use("/api/user", auth, userRoutes);

const port = process.env.PORT || 3001;

const server =
  process.env.NODE_ENV === "test"
    ? app.listen(0, () => {
        console.log(`server is running on port ${server.address().port}`);
      })
    : app.listen(port, () => {
        console.log(`server is running on port ${port}`);
      });

export default server;

