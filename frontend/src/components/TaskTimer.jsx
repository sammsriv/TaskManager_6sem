import React, { useState, useEffect, useRef } from 'react'
import { FaPlay, FaPause, FaStop } from 'react-icons/fa'

const TaskTimer = ({ taskId, onTimeUpdate }) => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef(null)

  // Key for localStorage
  const storageKey = `task-timer-${taskId}`

  // Initialize from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem(storageKey)
    if (savedState) {
      const { accumulatedTime, startTime, isRunning: savedIsRunning } = JSON.parse(savedState)
      
      if (savedIsRunning && startTime) {
        const elapsedSinceStart = Math.floor((Date.now() - startTime) / 1000)
        const totalTime = (accumulatedTime || 0) + elapsedSinceStart
        setTime(totalTime)
        setIsRunning(true)
      } else {
        setTime(accumulatedTime || 0)
        setIsRunning(false)
      }
    }
  }, [storageKey])

  // Timer interval logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => {
          const nextTime = prevTime + 1
          if (onTimeUpdate) onTimeUpdate(nextTime)
          return nextTime
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, onTimeUpdate])

  // Sync with localStorage whenever key states change
  const saveState = (newTime, newRunning, newStartTime) => {
    const state = {
      accumulatedTime: newTime,
      startTime: newStartTime,
      isRunning: newRunning
    }
    localStorage.setItem(storageKey, JSON.stringify(state))
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    const now = Date.now()
    setIsRunning(true)
    saveState(time, true, now)
  }

  const handlePause = () => {
    setIsRunning(false)
    saveState(time, false, null)
  }

  const handleStop = () => {
    setIsRunning(false)
    setTime(0)
    localStorage.removeItem(storageKey)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-mono text-gray-600 min-w-[60px]">
        {formatTime(time)}
      </span>
      <div className="flex gap-1">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="text-green-600 hover:text-green-800 p-1"
            title="Start timer"
          >
            <FaPlay className="text-sm" />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="text-yellow-600 hover:text-yellow-800 p-1"
            title="Pause timer"
          >
            <FaPause className="text-sm" />
          </button>
        )}
        <button
          onClick={handleStop}
          className="text-red-600 hover:text-red-800 p-1"
          title="Stop timer"
        >
          <FaStop className="text-sm" />
        </button>
      </div>
    </div>
  )
}

export default TaskTimer