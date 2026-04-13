import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import axiosInstance from "../../utils/axioInstance"
import DashboardLayout from "../../components/DashboardLayout"
import moment from "moment"
import AvatarGroup from "../../components/AvatarGroup"
import { FaExternalLinkAlt, FaTrash, FaCheckCircle } from "react-icons/fa"
import { MdRadioButtonUnchecked } from "react-icons/md"

const TaskDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { currentUser } = useSelector((state) => state.user)
  const [task, setTask] = useState(null)
  const [loadingDelete, setLoadingDelete] = useState(false)

  const getStatusTagColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/10"

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10"
    }
  }

  const [loading, setLoading] = useState(false)

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(`/tasks/${id}`)

      if (response.data) {
        const taskInfo = response.data

        setTask(taskInfo)
      }
    } catch (error) {
      console.log("Error fetching task details: ", error)
    }
  }

  const completeTask = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.put(`/tasks/${id}/status`, {
        status: "Completed",
      })

      if (response.data) {
        setTask(response.data.task || { ...task, status: "Completed", progress: 100 })
      }
    } catch (error) {
      console.log("Error completing task: ", error)
    } finally {
      setLoading(false)
    }
  }

  const updateTodoChecklist = async (index) => {
    const todoChecklist = task?.todoChecklist ? [...task.todoChecklist] : []

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed

      try {
        const response = await axiosInstance.put(`/tasks/${id}/todo`, {
          todoChecklist,
        })

        if (response.status === 200) {
          setTask(response.data?.task || task)
        } else {
          todoChecklist[index].completed = !todoChecklist[index].completed
        }
      } catch (error) {
        console.error("Error updating todo:", error)
        todoChecklist[index].completed = !todoChecklist[index].completed
      }
    }
  }

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link
    }

    window.open(link, "_blank")
  }

  const canModifyTask = () => {
    if (!task || !currentUser) return false

    const currentUserId = currentUser?._id?.toString?.() || currentUser?.id?.toString?.()
    const isAssigned = task?.assignedTo?.some((user) => {
      const userId = user?._id?.toString?.() || user?.toString?.()
      return userId && currentUserId && userId === currentUserId
    })

    return currentUser?.role === "admin" || isAssigned
  }

  const handleDelete = async () => {
    try {
      setLoadingDelete(true)
      await axiosInstance.delete(`/tasks/${id}`)
      navigate("/user/tasks")
    } catch (error) {
      console.log("Error deleting task:", error)
    } finally {
      setLoadingDelete(false)
    }
  }

  useEffect(() => {
    if (id) {
      getTaskDetailsById()
    }
  }, [id, getTaskDetailsById])

  return (
    <DashboardLayout activeMenu={"My Tasks"}>
      <div className="mt-5 px-4 sm:px-6 lg:px-8">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            <div className="md:col-span-3 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <div className="flex flex-col space-y-3">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    {task?.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusTagColor(
                        task?.status
                      )}`}
                    >
                      {task?.status}

                      <span className="ml-1.5 w-2 h-2 rounded-full bg-current opacity-80"></span>
                    </div>

                    {canModifyTask() && (
                      <button
                        onClick={handleDelete}
                        disabled={loadingDelete}
                        className="inline-flex items-center gap-2 text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full transition"
                      >
                        <FaTrash />
                        {loadingDelete ? "Deleting..." : "Delete"}
                      </button>
                    )}

                    {task?.status !== "Completed" && (
                      <button
                        onClick={completeTask}
                        disabled={loading}
                        className="text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full transition"
                      >
                        {loading ? "Completing..." : "Mark Complete"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <InfoBox label="Description" value={task?.description} />
                </div>

                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-6 md:col-span-4">
                    <InfoBox label={"Priority"} value={task?.priority} />
                  </div>

                  <div className="col-span-6 md:col-span-4">
                    <InfoBox
                      label={"Due Date"}
                      value={
                        task?.dueDate
                          ? moment(task?.dueDate).format("Do MMM YYYY")
                          : "N/A"
                      }
                    />
                  </div>

                  <div className="col-span-6 md:col-span-4">
                    <label className="text-xs font-medium text-slate-500">
                      Assigned To
                    </label>

                    <AvatarGroup
                      avatars={
                        task?.assignedTo?.map(
                          (item) => item?.profileImageUrl
                        ) || []
                      }
                      maxVisible={5}
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Todo Checklist
                  </label>

                  {task?.todoChecklist?.length > 0 ? (
                    task.todoChecklist.map((item, index) => (
                      <TodoCheckList
                        key={`todo_${index}`}
                        text={item.text}
                        isChecked={item?.completed}
                        onChange={() => updateTodoChecklist(index)}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      No todo checklist for this task.
                    </p>
                  )}
                </div>

                {task?.attachments?.length > 0 && (
                  <div className="mt-2">
                    <label className="text-xs font-medium text-slate-500">
                      Attachments
                    </label>

                    {task?.attachments?.map((link, index) => (
                      <Attachment
                        key={`link_${index}`}
                        link={link}
                        index={index}
                        onClick={() => handleLinkClick(link)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TaskDetails

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>

      <p className="text-[13px] md:text-sm font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  )
}

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <button
        onClick={onChange}
        className={`text-lg flex-shrink-0 ${isChecked ? "text-green-600" : "text-gray-400 hover:text-green-600"}`}
        type="button"
      >
        {isChecked ? <FaCheckCircle /> : <MdRadioButtonUnchecked />}
      </button>

      <p className={`text-sm ${isChecked ? "line-through text-gray-500" : "text-gray-800"}`}>
        {text}
      </p>
    </div>
  )
}

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-1 items-center gap-3">
        <span className="text-xs text-gray-400 font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>

        <p className="text-xs text-black">{link}</p>
      </div>

      <FaExternalLinkAlt className="text-gray-500" />
    </div>
  )
}
