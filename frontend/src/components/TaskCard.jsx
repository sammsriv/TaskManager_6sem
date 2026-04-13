import React from "react"
import Progress from "./Progress"
import moment from "moment"
import AvatarGroup from "./AvatarGroup"
import { FaFileLines } from "react-icons/fa6"
import { FaCheckCircle, FaTrash, FaEye, FaEdit } from "react-icons/fa"
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md"

const TaskCard = ({
  taskId,
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
  onView,
  onEdit,
  onTodoToggle,
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
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer h-fit"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 px-4 flex-wrap">
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

        <div className="ml-auto flex items-center gap-2">
          {canComplete && status !== "Completed" && onComplete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onComplete()
              }}
              disabled={completeLoading}
              className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-semibold"
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
                onDelete()
              }}
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-semibold"
              type="button"
            >
              <FaTrash />
            </button>
          )}

          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onView()
              }}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold"
              type="button"
            >
              <FaEye />
            </button>
          )}

          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 text-xs font-semibold"
              type="button"
            >
              <FaEdit />
            </button>
          )}
        </div>
      </div>

      <div
        className={`px-4 border-l-[3px] mt-4 ${status === "Completed"
            ? "border-indigo-500"
            : "border-violet-500"
          }`}
      >
        <p className="text-lg font-medium text-gray-800 line-clamp-2">
          {title}
        </p>

        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>

        {/* Todo Checklist UI */}
        {todoChecklist && todoChecklist.length > 0 && (
          <div className="mt-4 space-y-2">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[13px] text-gray-700 font-semibold border-b border-gray-100 pb-1 w-full">
                  Task Done: {completedTodoCount} / {todoChecklist.length}
                </span>
             </div>
             <div className="max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                {todoChecklist.map((todo, index) => (
                  <div key={index} className="flex items-center gap-2 py-0.5 group">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onTodoToggle) onTodoToggle(taskId, index)
                      }}
                      className={`text-lg flex-shrink-0 transition-colors ${
                        todo.completed ? "text-green-600" : "text-gray-400 group-hover:text-green-600"
                      }`}
                      type="button"
                    >
                      {todo.completed ? <MdCheckCircle /> : <MdRadioButtonUnchecked />}
                    </button>
                    <span className={`text-[13px] transition-all ${
                      todo.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}>
                      {todo.text}
                    </span>
                  </div>
                ))}
             </div>
          </div>
        )}

        <div className="mt-4">
          <Progress progress={progress} status={status} />
        </div>
      </div>

      <div className="px-4 mt-4">
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
