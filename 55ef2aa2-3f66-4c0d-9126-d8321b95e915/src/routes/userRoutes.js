import express from "express";
import userController from "../controller/userController.js";
import admin from "../middleware/admin.js";

const { updateUser, getUser, deleteUser, getAllUsers, getAllUserEmails, getUserGroups, addBalance } = userController;

const router = express.Router();

router.get("/:id", getUser);

export default router;
