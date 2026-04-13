import React, { useEffect, useState } from "react"
import axiosInstance from "../../utils/axioInstance"
import DashboardLayout from "../../components/DashboardLayout"
import { FaFileAlt } from "react-icons/fa"
import Modal from "../../components/Modal"
import toast from "react-hot-toast"

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/get-users")

      if (response.data?.length > 0) {
        setAllUsers(response.data)
      } else {
        setAllUsers([])
      }
    } catch (error) {
      console.log("Error fetching users: ", error)
    }
  }

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get("/reports/export/users", {
        responseType: "blob",
      })

      // create a url for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")

      link.href = url

      link.setAttribute("download", "user_details.xlsx")
      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log("Error downloading user-details report: ", error)
      toast.error("Error downloading user-details report. Please try again!")
    }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`)
      toast.success("User deleted successfully")
      getAllUsers()
      if (selectedUser?._id === userId) {
        setIsUserModalOpen(false)
        setSelectedUser(null)
      }
    } catch (error) {
      console.log("Error deleting user: ", error)
      toast.error("Unable to delete user. Please try again.")
    }
  }

  useEffect(() => {
    getAllUsers()

    return () => { }
  }, [])

  return (
    <DashboardLayout activeMenu={"Team Members"}>
      <div className="mt-5 mb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Team Members</h2>

          <button
            type="button"
            className="flex items-center gap-1 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-gray-800 rounded-lg transition-colors duration-200 font-medium shadow-sm hover:shadow-md cursor-pointer text-lg"
            onClick={handleDownloadReport}
          >
            <FaFileAlt className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <div
              key={user._id}
              className="p-4 bg-white rounded-xl shadow-md shadow-gray-100 border border-gray-200/50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.profileImageUrl}
                    alt={user?.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-white"
                  />

                  <div>
                    <p className="text-lg font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewUser(user)}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Pending</p>
                  <p className="text-lg font-semibold text-gray-900">{user.pendingTasks || 0}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                  <p className="text-xs uppercase tracking-wide text-gray-500">In Progress</p>
                  <p className="text-lg font-semibold text-gray-900">{user.inProgressTasks || 0}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Completed</p>
                  <p className="text-lg font-semibold text-gray-900">{user.completedTasks || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={selectedUser ? selectedUser.name : "User details"}
      >
        {selectedUser ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-base font-medium">{selectedUser.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending tasks</p>
              <p className="text-base font-medium">{selectedUser.pendingTasks || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">In progress</p>
              <p className="text-base font-medium">{selectedUser.inProgressTasks || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-base font-medium">{selectedUser.completedTasks || 0}</p>
            </div>
          </div>
        ) : (
          <p>No user selected</p>
        )}
      </Modal>
    </DashboardLayout>
  )
}

export default ManageUsers
