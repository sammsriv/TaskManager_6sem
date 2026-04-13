import React, { useState } from "react"
import { ImAttachment } from "react-icons/im"
import { MdDelete } from "react-icons/md"
import uploadImage from "../utils/uploadImage"
import { IoMdAdd, IoMdCloudUpload } from "react-icons/io"

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleAddOption = () => {
    if (option.trim() !== "") {
      setAttachments([...attachments, option.trim()])
      setOption("")
    }
  }

  const handleDeleteOption = (index) => {
    const updatedArray = attachments.filter((_, i) => i !== index)
    setAttachments(updatedArray)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setIsUploading(true)
      const response = await uploadImage(file)
      if (response && response.imageUrl) {
        setAttachments([...attachments, response.imageUrl])
      }
    } catch (error) {
      console.log("Error uploading file:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      {attachments.map((item, index) => (
        <div
          key={item}
          className="flex items-center justify-between bg-gray-50 border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <div className="flex-1 flex items-center gap-3 border border-gray-100">
            <ImAttachment className="text-gray-400" />

            <p className="text-sm text-black truncate max-w-[200px] sm:max-w-md">
              {item}
            </p>
          </div>

          <button
            type="button"
            className="cursor-pointer"
            onClick={() => handleDeleteOption(index)}
          >
            <MdDelete className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-3 border border-gray-100 px-3 py-2 rounded-md">
            <ImAttachment className="text-gray-400" />

            <input
              type="text"
              placeholder="Add File Link"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              className="w-full text-[13px] text-black outline-none bg-white border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            onClick={handleAddOption}
          >
            <IoMdAdd className="text-lg" />
            Add
          </button>
        </div>

        <div className="flex items-center justify-center">
          <label className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <IoMdCloudUpload className="text-xl text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">
              {isUploading ? 'Uploading...' : 'Upload from Device'}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default AddAttachmentsInput
