import React, { useEffect, useState, useCallback } from "react"
import DashboardLayout from "../../components/DashboardLayout"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import axiosInstance from "../../utils/axioInstance"
import TaskStatusTabs from "../../components/TaskStatusTabs"
import { FaFileLines } from "react-icons/fa6"
import TaskCard from "../../components/TaskCard"
import toast from "react-hot-toast"
import TaskSummaryModal from "../../components/TaskSummaryModal"

const MyTask = () => {
  const [allTasks, setAllTasks] = useState([])
  const [tabs, setTabs] = useState([
    { label: "All", count: 0 },
    { label: "Pending", count: 0 },
    { label: "Completed", count: 0 },
  ])
  const [filterStatus, setFilterStatus] = useState("All")
  const [loadingTaskId, setLoadingTaskId] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)

  const { currentUser } = useSelector((state) => state.user)

  const navigate = useNavigate()

  const getAllTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/tasks", {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      })

      if (response?.data) {
        setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])
      }

      const statusSummary = response.data?.statusSummary || {}

      setTabs([
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ])
    } catch (error) {
      console.log("Error fetching tasks: ", error)
    }
  }, [filterStatus])

  const handleViewTask = (taskData) => {
    setSelectedTask(taskData)
    setIsSummaryOpen(true)
  }

  const handleEditTask = (taskData) => {
    navigate("/user/create-task", { state: { taskId: taskData._id } })
  }

  const handleCompleteTask = async (taskId) => {
    try {
      setLoadingTaskId(taskId)
      await axiosInstance.put(`/tasks/${taskId}/status`, {
        status: "Completed",
      })
      toast.success("Task completed!")
      getAllTasks()
    } catch (error) {
      console.log("Error completing task: ", error)
      toast.error("Unable to complete task")
    } finally {
      setLoadingTaskId(null)
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`)
      toast.success("Task deleted successfully!")
      getAllTasks() // Refresh list
    } catch (error) {
      console.log("Error deleting task:", error)
      toast.error("Failed to delete task!")
    }
  }

  const handleTodoToggle = useCallback(async (taskId, todoIndex) => {
    try {
      const task = allTasks.find(t => t._id === taskId)
      if (!task) return

      const updatedTodoList = task.todoChecklist.map((todo, index) => ({
        text: todo.text,
        completed: index === todoIndex ? !todo.completed : todo.completed
      }))

      await axiosInstance.put(`/tasks/${taskId}/todo`, {
        todoChecklist: updatedTodoList
      })

      toast.success("Todo updated!")
      getAllTasks()
    } catch (error) {
      console.log("Error updating todo:", error)
      toast.error("Error updating todo!")
    }
  }, [allTasks, getAllTasks])

  useEffect(() => {
    getAllTasks()
  }, [getAllTasks])

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between gap-4 w-full md:w-auto ">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Tasks
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {allTasks?.length > 0 ? (
            allTasks?.map((item) => (
              <TaskCard
                key={item._id}
                taskId={item._id}
                title={item.title}
                description={item.description}
                priority={item.priority}
                status={item.status}
                progress={item.progress}
                createdAt={item.createdAt}
                dueDate={item.dueDate}
                assignedTo={item.assignedTo?.map(
                  (item) => item.profileImageUrl
                )}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                canComplete={
                  item.status !== "Completed" &&
                  item.assignedTo?.some((user) => {
                    const userId = user?._id?.toString?.() || user?.toString?.()
                    const currentUserId = currentUser?._id?.toString?.() || currentUser?.id?.toString?.()
                    return userId && currentUserId && userId === currentUserId
                  })
                }
                onComplete={() => handleCompleteTask(item._id)}
                completeLoading={loadingTaskId === item._id}
                onDelete={() => handleDeleteTask(item._id)}
                onView={() => handleViewTask(item)}
                onEdit={() => handleEditTask(item)}
                onTodoToggle={handleTodoToggle}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">
                No tasks found. Create a new task to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      <TaskSummaryModal 
        isOpen={isSummaryOpen} 
        onClose={() => setIsSummaryOpen(false)} 
        task={selectedTask} 
      />
    </DashboardLayout>
  )
}

export default MyTask
