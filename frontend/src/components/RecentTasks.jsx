import moment from "moment"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md"
import { FaTrash } from "react-icons/fa"
import axiosInstance from "../utils/axioInstance"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import TaskTimer from "./TaskTimer"

const RecentTasks = ({ tasks, onTaskCompleted }) => {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [loadingTaskId, setLoadingTaskId] = useState(null)
  const [expandedTasks, setExpandedTasks] = useState(new Set())

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
        onTaskCompleted()
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

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Recent Tasks</h3>

        <button
          onClick={() => navigate("/admin/tasks")}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors p-2 bg-blue-50 hover:bg-blue-100"
        >
          See More →
        </button>
      </div>

      <div className="p-6">
        {tasks?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task Name
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Todo Items
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timer
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created On
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {task.title}
                      </div>
                      {task.todoChecklist && task.todoChecklist.length > 0 && (
                        <button
                          onClick={() => toggleTaskExpansion(task._id)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                        >
                          {expandedTasks.has(task._id) ? 'Hide' : 'Show'} todos ({task.todoChecklist.length})
                        </button>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${task.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : task.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${task.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "Medium"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {expandedTasks.has(task._id) ? (
                          task.todoChecklist?.map((todo, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <button
                                onClick={() => handleTodoToggle(task._id, index)}
                                className={`text-lg ${todo.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                                  }`}
                              >
                                {todo.completed ? (
                                  <MdCheckCircle />
                                ) : (
                                  <MdRadioButtonUnchecked />
                                )}
                              </button>
                              <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                {todo.text}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">
                            {task.todoChecklist?.length || 0} items
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <TaskTimer taskId={task._id} />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {moment(task.createdAt).format("MMM Do, YYYY")}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2">
                      {task.status !== "Completed" ? (
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          disabled={loadingTaskId === task._id}
                          className="text-green-600 hover:text-green-800 disabled:opacity-50 transition-colors"
                          title="Mark as completed"
                        >
                          <MdCheckCircle className="text-2xl" />
                        </button>
                      ) : (
                        <span className="text-green-600">
                          <MdCheckCircle className="text-2xl" />
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete Task"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default RecentTasks
