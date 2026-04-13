import React, { useState } from "react"
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import axiosInstance from "../utils/axioInstance"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import TaskTimer from "./TaskTimer"

const DashboardTasks = ({ tasks, onTaskCompleted }) => {
  const { currentUser } = useSelector((state) => state.user)
  const [loadingTaskId, setLoadingTaskId] = useState(null)

  const handleCompleteTask = async (taskId) => {
    try {
      setLoadingTaskId(taskId)
      await axiosInstance.put(`/tasks/${taskId}/status`, {
        status: "Completed",
      })
      toast.success("Task completed!")
      if (onTaskCompleted) {
        onTaskCompleted()
      }
    } catch (error) {
      console.log("Error completing task:", error)
      toast.error("Error completing task!")
    } finally {
      setLoadingTaskId(null)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return
    try {
      await axiosInstance.delete(`/tasks/${taskId}`)
      toast.success("Task deleted successfully!")
      if (onTaskCompleted) {
        onTaskCompleted() // Using onTaskCompleted to refresh parent data
      }
    } catch (error) {
      console.log("Error deleting task:", error)
      toast.error("Failed to delete task!")
    }
  }

  const handleTodoToggle = async (taskId, todoIndex) => {
    try {
      const task = tasks.find(t => t._id === taskId)
      if (!task) return

      const updatedTodoList = task.todoChecklist.map((todo, index) => ({
        text: todo.text,
        completed: index === todoIndex ? !todo.completed : todo.completed
      }))

      await axiosInstance.put(`/tasks/${taskId}/todo`, {
        todoChecklist: updatedTodoList
      })

      toast.success("Todo updated!")
      if (onTaskCompleted) {
        onTaskCompleted()
      }
    } catch (error) {
      console.log("Error updating todo:", error)
      toast.error("Error updating todo!")
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Tasks Overview</h3>
        <p className="text-sm text-gray-600 mt-1">Manage your tasks and todos directly from here</p>
      </div>

      <div className="p-6">
        {tasks?.length > 0 ? (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Task Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "Medium"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {task.status !== "Completed" && (
                      <TaskTimer taskId={task._id} />
                    )}

                    {(currentUser?.role === "admin" ||
                      task.assignedTo?.some((user) => {
                        const userId = user?._id?.toString?.() || user?.toString?.()
                        const currentUserId = currentUser?._id?.toString?.() || currentUser?.id?.toString?.()
                        return userId && currentUserId && userId === currentUserId
                      })) &&
                      task.status !== "Completed" && (
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          disabled={loadingTaskId === task._id}
                          className="text-green-600 hover:text-green-800 disabled:opacity-50 transition-colors"
                          title="Mark as completed"
                        >
                          <MdCheckCircle className="text-2xl" />
                        </button>
                      )}
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-800 transition-colors ml-2"
                      title="Delete task"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Todo Items */}
                {task.todoChecklist && task.todoChecklist.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Todo Items:</h5>
                    {task.todoChecklist.map((todo, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <button
                          onClick={() => handleTodoToggle(task._id, index)}
                          className={`text-lg flex-shrink-0 ${todo.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                            }`}
                        >
                          {todo.completed ? (
                            <MdCheckCircle />
                          ) : (
                            <MdRadioButtonUnchecked />
                          )}
                        </button>
                        <span className={`text-sm flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                          • {todo.text}
                        </span>
                        {task.status !== "Completed" && !todo.completed && (
                          <TaskTimer taskId={`${task._id}-todo-${index}`} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Task Description */}
                {task.description && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No recent tasks found
          </p>
        )}
      </div>
    </div>
  )
}

export default DashboardTasks