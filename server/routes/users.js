import express from "express";
import { getUsers, getUsersByID, createUser, updateUser, deleteUser } from "../controllers/usersController.js";

const router = express.Router();

// GET all users
router.get("/", getUsers);

// GET single user
router.get("/:id", getUsersByID);

// CREATE user
router.post("/", createUser);

// UPDATE user
router.put("/:id", updateUser);

// DELETE user
router.delete("/:id", deleteUser);

export default router;