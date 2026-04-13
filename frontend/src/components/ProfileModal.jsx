import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IoMdCloudUpload } from "react-icons/io"
import Modal from "./Modal"
import uploadImage from "../utils/uploadImage"
import axiosInstance from "../utils/axioInstance"
import { signInSuccess } from "../redux/slice/userSlice"
import toast from "react-hot-toast"

const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    profileImageUrl: currentUser?.profileImageUrl || "",
  })

  const [isUploading, setIsUploading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setIsUploading(true)
      const response = await uploadImage(file)
      if (response && response.imageUrl) {
        setFormData({ ...formData, profileImageUrl: response.imageUrl })
        toast.success("Image uploaded!")
      }
    } catch (error) {
      console.log("Error uploading image:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and Email are required!")
      return
    }

    try {
      setIsUpdating(true)
      const response = await axiosInstance.put("/auth/update-profile", formData)
      
      if (response.data) {
        dispatch(signInSuccess(response.data))
        toast.success("Profile updated successfully!")
        onClose()
      }
    } catch (error) {
      console.log("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-blue-200">
              {formData.profileImageUrl ? (
                <img
                  src={formData.profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl capitalize">
                  {formData.name.charAt(0)}
                </div>
              )}
            </div>
            
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <IoMdCloudUpload className="text-2xl" />
            </label>
          </div>
          <p className="text-xs text-gray-500 font-medium italic">
            {isUploading ? "Uploading..." : "Click image to change"}
          </p>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name"
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your@email.com"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating || isUploading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md disabled:bg-blue-300"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ProfileModal
