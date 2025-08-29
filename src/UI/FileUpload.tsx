'use client';

import { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  title: string;
  description: string;
  required?: boolean;
  optional?: boolean;
  acceptedFormats?: string[];
  maxSize?: number;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export default function FileUpload({
  title,
  description,
  required = false,
  optional = false,
  acceptedFormats = ['PDF', 'DOC', 'DOCX'],
  maxSize = 50,
  onFileSelect,
  className = ''
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const validFormats = acceptedFormats.map(format => format.toLowerCase());
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !validFormats.includes(fileExtension)) {
      alert(`Please select a valid file format: ${acceptedFormats.join(', ')}`);
      return false;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return false;
    }
    
    return true;
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className={`border rounded-lg p-6 bg-white ${className}`} style={{ borderColor: 'var(--color-tertiary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg" style={{ color: 'var(--color-dark-gray)' }}>
            {title}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {optional && (
            <span 
              className="inline-block px-2 py-1 text-xs rounded-full ml-2"
              style={{ 
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-dark-gray)'
              }}
            >
              Optional
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm mb-4" style={{ color: 'var(--color-medium-gray)' }}>
        {description}
      </p>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragOver ? 'border-blue-400 bg-blue-50' : ''}
          ${selectedFile ? 'border-green-400 bg-green-50' : ''}
        `}
        style={{ 
          borderColor: selectedFile ? 'var(--color-accent)' : 'var(--color-tertiary)',
          backgroundColor: selectedFile ? 'var(--color-light-blue)' : 'transparent'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {selectedFile ? (
          <div>
            <FileText className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--color-accent)' }} />
            <p className="font-medium" style={{ color: 'var(--color-dark-gray)' }}>
              {selectedFile.name}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-medium-gray)' }}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="mt-3 px-4 py-2 text-sm rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-dark-gray)'
              }}
            >
              Remove File
            </button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--color-light-gray)' }} />
            <p className="font-medium mb-2" style={{ color: 'var(--color-dark-gray)' }}>
              Drag & drop your document here or click to browse files
            </p>
            <p className="text-sm" style={{ color: 'var(--color-light-gray)' }}>
              Supports {acceptedFormats.join(', ')} (Max {maxSize}MB)
            </p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.map(format => `.${format.toLowerCase()}`).join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
