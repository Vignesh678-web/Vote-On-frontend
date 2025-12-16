// components/Upload.jsx
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const UploadComponent = ({ classInfo, fileInputRef, handleFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files: files } };
      handleFileUpload(event);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 space-y-6" style={{ background: 'linear-gradient(to bottom, #000000, #0a0f0a)' }}>
      <div 
        className="bg-gray-900 rounded-xl shadow-sm p-6 border border-green-500/30"
        style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.15)' }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/40"
            style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}
          >
            <Upload 
              className="w-6 h-6 text-blue-400" 
              style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' }} 
            />
          </div>
          <div>
            <h3 
              className="text-2xl font-bold text-white mb-1"
              style={{ textShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}
            >
              Upload Class Student Data
            </h3>
            <p className="text-sm text-blue-400 font-semibold">{classInfo?.className || 'Class'}</p>
          </div>
        </div>
        
        <div 
          onClick={() => fileInputRef?.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group ${
            isDragging 
              ? 'border-green-400 bg-green-500/10' 
              : 'border-green-500/40 hover:border-green-400 hover:bg-green-500/5'
          }`}
          style={{ 
            boxShadow: isDragging 
              ? '0 0 40px rgba(34, 197, 94, 0.3), inset 0 0 30px rgba(34, 197, 94, 0.1)' 
              : '0 0 20px rgba(34, 197, 94, 0.1)'
          }}
        >
          <div 
            className={`w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all duration-300 border ${
              isDragging 
                ? 'bg-green-500/30 border-green-400/60 scale-110' 
                : 'bg-gray-800 border-green-500/30 group-hover:bg-green-500/20 group-hover:border-green-500/50 group-hover:scale-105'
            }`}
            style={{ 
              boxShadow: isDragging 
                ? '0 0 30px rgba(34, 197, 94, 0.5)' 
                : '0 0 15px rgba(34, 197, 94, 0.2)'
            }}
          >
            <Upload 
              className={`w-10 h-10 transition-all duration-300 ${
                isDragging ? 'text-green-300' : 'text-green-400 group-hover:text-green-300'
              }`}
              style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))' }}
            />
          </div>
          <p 
            className={`mb-2 font-bold text-xl transition-all duration-300 ${
              isDragging ? 'text-green-300' : 'text-white group-hover:text-green-400'
            }`}
            style={{ textShadow: '0 0 15px rgba(34, 197, 94, 0.3)' }}
          >
            {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-gray-400 font-medium">CSV or Excel files (MAX. 5MB)</p>
        </div>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv,.xlsx,.xls" 
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div 
          className="mt-6 p-6 bg-blue-500/10 border border-blue-500/40 rounded-xl"
          style={{ boxShadow: '0 0 25px rgba(59, 130, 246, 0.15)' }}
        >
          <h4 
            className="font-bold text-white mb-4 flex items-center gap-3 text-lg"
            style={{ textShadow: '0 0 12px rgba(59, 130, 246, 0.3)' }}
          >
            <FileText className="w-5 h-5 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))' }} />
            File Format Requirements
          </h4>
          <ul className="text-sm text-blue-300 space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg">•</span>
              <span><strong className="text-white">Column 1:</strong> Student Name</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg">•</span>
              <span><strong className="text-white">Column 2:</strong> Admission Number</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg">•</span>
              <span><strong className="text-white">Column 3:</strong> Attendance Percentage</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg">•</span>
              <span><strong className="text-white">Column 4:</strong> Email Address</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-400 font-bold text-lg">•</span>
              <span><strong className="text-white">Column 5:</strong> Roll Number</span>
            </li>
          </ul>
        </div>
      </div>

      <div 
        className="bg-gray-900 rounded-xl shadow-sm p-6 border border-green-500/30"
        style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.15)' }}
      >
        <h3 
          className="text-xl font-bold text-white mb-5 flex items-center gap-3"
          style={{ textShadow: '0 0 12px rgba(34, 197, 94, 0.3)' }}
        >
          <FileText className="w-6 h-6 text-green-400" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))' }} />
          Recent Uploads
        </h3>
        <div className="space-y-3">
          <div 
            className="flex items-center justify-between p-5 bg-black/40 rounded-xl border border-green-500/40 hover:border-green-500/60 transition-all duration-300 group"
            style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
          >
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div 
                className="p-3 bg-green-500/20 rounded-lg flex-shrink-0 border border-green-500/40 group-hover:scale-110 transition-transform"
                style={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)' }}
              >
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white truncate mb-1">class_10a_students.csv</p>
                <p className="text-xs text-gray-400 font-medium">Uploaded 2 hours ago • {classInfo?.totalStudents || 0} records</p>
              </div>
            </div>
            <span 
              className="px-4 py-2 bg-green-600 text-black rounded-full text-xs font-bold ml-4 border border-green-400/50 flex items-center gap-2"
              style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)' }}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              SUCCESS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadComponent;