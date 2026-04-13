import React from "react"
import Modal from "./Modal"
import Progress from "./Progress"
import moment from "moment"
import AvatarGroup from "./AvatarGroup"
import { FaFileLines, FaRegClock } from "react-icons/fa6"
import { FaRegCheckCircle, FaRegCircle } from "react-icons/fa"

const TaskSummaryModal = ({ isOpen, onClose, task }) => {
  if (!task) return null

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-green-100 text-green-700"
    }
  }

  const getStatusColor = (status) => {
    return status === "Completed"
      ? "bg-indigo-100 text-indigo-700"
      : "bg-yellow-100 text-yellow-700"
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Summary">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Header-like Info */}
        <div className="flex flex-wrap gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
            {task.priority} Priority
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {task.description || "No description provided."}
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <FaRegClock className="text-blue-500" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Start Date</p>
              <p className="text-sm font-semibold text-gray-700">{moment(task.createdAt).format("Do MMM YYYY")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
            <FaRegClock className="text-red-500" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Due Date</p>
              <p className="text-sm font-semibold text-gray-700">{moment(task.dueDate).format("Do MMM YYYY")}</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Overall Progress</h3>
          <Progress progress={task.progress} status={task.status} />
        </div>

        {/* Assigned To */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Assigned To</h3>
          <div className="flex items-center gap-3">
             <AvatarGroup avatars={task.assignedTo?.map(u => u.profileImageUrl || u) || []} />
             <div className="flex flex-wrap gap-2">
                {task.assignedTo?.map((user, index) => (
                  <span key={index} className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
                    {user.name || "Member"}
                  </span>
                ))}
             </div>
          </div>
        </div>

        {/* Todo Checklist */}
        {task.todoChecklist?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Todo Checklist</h3>
            <div className="space-y-2">
              {task.todoChecklist.map((todo, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                  {todo.completed ? (
                    <FaRegCheckCircle className="text-green-500 shrink-0" />
                  ) : (
                    <FaRegCircle className="text-gray-300 shrink-0" />
                  )}
                  <span className={`text-sm ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                    {todo.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Attachments</h3>
            <div className="grid grid-cols-1 gap-2">
              {task.attachments.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3 truncate">
                    <FaFileLines className="text-blue-500" />
                    <span className="text-sm font-medium text-blue-700 truncate">{link}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-600 ml-2">OPEN</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors font-semibold"
            >
                Close View
            </button>
        </div>
      </div>
    </Modal>
  )
}

export default TaskSummaryModal
