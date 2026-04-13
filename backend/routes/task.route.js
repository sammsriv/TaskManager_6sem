import express from "express"
import { adminOnly, verifyToken } from "../utils/verifyUser.js"
import {
  createTask,
  deleteTask,
  getDashboardData,
  getOverdueTasks,
  getTaskById,
  getTaskSummary,
  getTasks,
  updateTask,
  updateTaskChecklist,
  updateTaskStatus,
  userDashboardData,
  assignTaskToAdmin,
} from "../controller/task.controller.js"

const router = express.Router()

router.post("/create", verifyToken, createTask)

router.post("/admin/assign-to-self", verifyToken, adminOnly, assignTaskToAdmin)

router.get("/", verifyToken, getTasks)

router.get("/overdue", verifyToken, getOverdueTasks)

router.get("/summary", verifyToken, getTaskSummary)

router.get("/dashboard-data", verifyToken, adminOnly, getDashboardData)

router.get("/user-dashboard-data", verifyToken, userDashboardData)

router.get("/:id", verifyToken, getTaskById)

router.put("/:id", verifyToken, updateTask)

router.delete("/:id", verifyToken, deleteTask)

router.put("/:id/status", verifyToken, updateTaskStatus)

router.put("/:id/todo", verifyToken, updateTaskChecklist)

export default router
