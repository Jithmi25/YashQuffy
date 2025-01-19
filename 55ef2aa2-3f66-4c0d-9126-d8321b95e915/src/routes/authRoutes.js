import express from "express";
import authController from "../controller/authController.js";

const { signup, login } = authController;

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

export default router;
