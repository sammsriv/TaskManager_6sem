import React, { useEffect, useState } from "react"
import axiosInstance from "../utils/axioInstance"
import { useDispatch, useSelector } from "react-redux"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useNavigate } from "react-router-dom"
import { SIDE_MENU_DATA, USER_SIDE_MENU_DATA } from "../utils/data"
import ProfileModal from "./ProfileModal"

const SideMenu = ({ activeMenu }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [SideMenuData, setSideMenuData] = useState([])
  const [openProfileModal, setOpenProfileModal] = useState(false)
  const { currentUser } = useSelector((state) => state.user)

  const handleClick = (route) => {
    console.log(route)

    if (route === "logout") {
      handleLogut()
      return
    }

    navigate(route)
  }

  const handleLogut = async () => {
    try {
      const response = await axiosInstance.post("/auth/sign-out")

      if (response.data) {
        dispatch(signOutSuccess())

        navigate("/login")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser) {
      setSideMenuData(
        currentUser?.role === "admin" ? SIDE_MENU_DATA : USER_SIDE_MENU_DATA
      )
    }

    return () => {}
  }, [currentUser])

  return (
    <div className="w-64 p-6 h-full flex flex-col lg:border-r lg:border-gray-200">
      <div 
        className="flex flex-col items-center mb-8 bg-gray-50/50 p-4 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer group"
        onClick={() => setOpenProfileModal(true)}
        title="Click to edit profile"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden mb-4 border-2 border-blue-200 group-hover:border-blue-400 transition-colors">
            {currentUser?.profileImageUrl ? (
              <img
                src={currentUser?.profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl capitalize bg-white">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="absolute bottom-4 right-0 bg-blue-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>

        {currentUser?.role === "admin" && (
          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
            Admin
          </div>
        )}

        <h5 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
          {currentUser?.name || ""}
        </h5>

        <p className="text-sm text-gray-500">{currentUser?.email || ""}</p>
      </div>

      <div className="flex-1 overscroll-y-auto">
        {SideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu === item.label
                ? "text-blue-500 bg-linear-to-r from-blue-50/40 to-blue-100/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            } py-3 px-6 mb-3 rounded-lg transition-all cursor-pointer`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-2xl" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <ProfileModal 
        isOpen={openProfileModal} 
        onClose={() => setOpenProfileModal(false)} 
      />
    </div>
  )
}

export default SideMenu
