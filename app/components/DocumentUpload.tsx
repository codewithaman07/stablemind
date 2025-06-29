'use client';

import { useState, useEffect } from 'react';
import { FaTrash, FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa';
import { processDocument, getAllDocuments, deleteDocument, UserDocument } from '../services/documentService';

export default function DocumentUpload() {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  // Load documents on component mount
  useEffect(() => {
    setDocuments(getAllDocuments());
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setFileName(file.name);
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Check file size (limit to 5MB for browser-based processing)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit. Please upload a smaller file.");
      }
      
      const result = await processDocument(file);
      
      if (result) {
        setDocuments(getAllDocuments());
        setSuccess(`Successfully uploaded "${file.name}". This document will now be used to provide context for your questions.`);
      } else {
        setError("Failed to process document. Please try another file or format.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during upload";
      setError(errorMessage);
      console.error("Document upload error:", err);
    } finally {
      setIsUploading(false);
      setFileName('');
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      if (deleteDocument(id)) {
        setDocuments(getAllDocuments());
        setSuccess("Document deleted successfully");
      } else {
        setError("Failed to delete document");
      }
    }
  };

  // Get appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('word') || fileType.includes('docx')) return <FaFileWord className="text-blue-500" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FaFileExcel className="text-green-500" />;
    if (fileType.includes('text')) return <FaFileAlt className="text-gray-500" />;
    return <FaFile className="text-gray-400" />;
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Custom Knowledge</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Upload your own documents to enhance StableMind&apos;s responses with personalized context.
      </p>
      
      {/* Success/Error messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg">
          {success}
        </div>
      )}
      
      {/* File upload area */}
      <div className="mb-6">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:border-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce delay-200"></div>
                </div>
              ) : (
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
              )}
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">{isUploading ? 'Uploading...' : 'Click to upload'}</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                TXT, PDF, DOC, DOCX (MAX. 5MB)
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
        {fileName && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Selected: {fileName}
          </p>
        )}
      </div>
      
      {/* Document list */}
      {documents.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-800 dark:text-white mb-3">Your Documents</h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {documents.map((doc) => (
              <li key={doc.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{doc.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(doc.fileSize)} • {new Date(doc.dateAdded).toLocaleDateString()}
                        </span>
                      </div>
                      {doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {doc.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    title="Delete document"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
