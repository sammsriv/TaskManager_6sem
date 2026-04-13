import React from "react"
import Progress from "./Progress"
import moment from "moment"
import AvatarGroup from "./AvatarGroup"
import { FaFileLines } from "react-icons/fa6"
import { FaCheckCircle, FaTrash } from "react-icons/fa"

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
  canComplete,
  onComplete,
  completeLoading,
  onDelete,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getPriorityTagColor = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded-lg`}
        >
          {status}
        </div>

        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded-lg`}
        >
          {priority} Priority
        </div>

        {canComplete && status !== "Completed" && onComplete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onComplete()
            }}
            disabled={completeLoading}
            className="ml-auto inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-semibold"
            type="button"
          >
            <FaCheckCircle />
            {completeLoading ? "Saving..." : "Done"}
          </button>
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm("Are you sure you want to delete this task?")) {
                onDelete()
              }
            }}
            className="ml-auto inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-semibold"
            type="button"
          >
            <FaTrash />
            Delete
          </button>
        )}
      </div>

      <div
        className={`px-4 border-l-[3px] ${status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
          }`}
      >
        <p className="text-lg font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>

        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>

        {todoChecklist && todoChecklist.length > 0 ? (
          <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
            Task Done:{" "}
            <span className="font-semibold text-gray-700">
              {completedTodoCount} / {todoChecklist.length}
            </span>
          </p>
        ) : (
          <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
            No checklist required for this task.
          </p>
        )}

        <Progress progress={progress} status={status} />
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Start Date</label>

            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Due Date</label>

            <p className="text-[13px] font-medium text-gray-900">
              {moment(dueDate).format("Do MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <FaFileLines className="text-primary" />

              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard
