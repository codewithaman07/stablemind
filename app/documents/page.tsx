'use client';

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DocumentUpload from "../components/DocumentUpload";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const router = useRouter();
  
  return (
    <DashboardLayout>
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <FaArrowLeft size={14} />
              <span>Back to Chat</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white ml-4">
              Custom Knowledge Base
            </h1>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              Upload your own documents to enhance StableMind's responses with personalized context.
              Your documents will be processed locally in your browser and used to provide more relevant
              answers tailored to your specific needs.
            </p>
          </div>
          
          <DocumentUpload />
          
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              How Your Documents Are Used
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Privacy Preserved:</strong> Your documents are processed entirely in your browser.
                No document content is sent to our servers.
              </li>
              <li>
                <strong>Local Storage:</strong> Document content is stored locally in your browser's storage.
                Clearing your browser data will remove these documents.
              </li>
              <li>
                <strong>Contextual Retrieval:</strong> When you ask a question, relevant parts of your documents
                are retrieved and sent as context along with your question.
              </li>
              <li>
                <strong>Better Answers:</strong> The AI can provide more personalized answers by referencing your
                uploaded materials when relevant.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
