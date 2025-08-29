"use client"

import { useState } from "react"
import { ChevronDown, Check, X } from "lucide-react"

interface BasicDropdownProps {
  options: string[]
  placeholder?: string
  className?: string    
  value?: string
  onChange?: (value: string) => void
}

export function BasicDropdown({ options, placeholder = "Select option", className = "", value, onChange }: BasicDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option: string) => {
    onChange?.(option)
    setIsOpen(false)
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-200"
      >
        {value || placeholder}
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right rounded-md shadow-lg border border-gray-200 bg-white">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors duration-150 ${
                  value === option ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
              >
                {value === option && <Check className="w-4 h-4 mr-2 text-blue-600" />}
                <span className={value === option ? "ml-0" : "ml-6"}>{option}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface MultiSelectDropdownProps {
  options: string[]
  placeholder?: string
  className?: string
  value?: string[]
  onChange?: (value: string[]) => void
}

export function MultiSelectDropdown({ options, placeholder = "Select options", className = "", value = [], onChange }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOption = (option: string) => {
    const newValue = value.includes(option) 
      ? value.filter((item) => item !== option) 
      : [...value, option]
    onChange?.(newValue)
  }

  const removeOption = (option: string) => {
    const newValue = value.filter((item) => item !== option)
    onChange?.(newValue)
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-64 px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-200 min-h-[40px]"
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
              >
                {item}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer hover:opacity-70"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeOption(item)
                  }}
                />
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-64 mt-2 origin-top-right rounded-md shadow-lg border border-gray-200 bg-white max-h-60 overflow-y-auto">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors duration-150 ${
                  value.includes(option) ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
              >
                <div className="w-4 h-4 mr-2 border rounded flex items-center justify-center border-gray-300">
                  {value.includes(option) && <Check className="w-3 h-3 text-blue-600" />}
                </div>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
  