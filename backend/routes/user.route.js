import express from "express"
import { adminOnly, verifyToken } from "../utils/verifyUser.js"
import {
  deleteUser,
  getUserById,
  getUsers,
} from "../controller/user.controller.js"

const router = express.Router()

// User management routes
router.get("/get-users", verifyToken, getUsers)
router.delete("/:id", verifyToken, adminOnly, deleteUser)
router.get("/:id", verifyToken, getUserById)

export default router
