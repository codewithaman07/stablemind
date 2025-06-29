"use client";

// import { ParseResult } from "@/types/documentTypes";

// Constants
const STORAGE_KEY = "stablemind_user_documents";

// Types for document storage
export interface UserDocument {
  id: string;
  title: string;
  content: string;
  tags: string[];
  dateAdded: string;
  fileType: string;
  fileSize: number;
}

// In-memory storage for uploaded documents (would use a database in production)
let userDocuments: UserDocument[] = [];

// Load documents from localStorage on initialization (client-side only)
if (typeof window !== 'undefined') {
  try {
    const storedDocs = localStorage.getItem(STORAGE_KEY);
    if (storedDocs) {
      userDocuments = JSON.parse(storedDocs);
    }
  } catch (error) {
    console.error("Error loading documents from localStorage:", error);
  }
}

/**
 * Process and store an uploaded document
 */
export async function processDocument(file: File): Promise<UserDocument | null> {
  try {
    // Read the file content
    const content = await extractTextFromFile(file);
    
    if (!content) {
      throw new Error("Could not extract text from file");
    }
    
    // Extract potential tags from content
    const tags = extractTags(content);
    
    // Create document record
    const document: UserDocument = {
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: file.name,
      content: content,
      tags: tags,
      dateAdded: new Date().toISOString(),
      fileType: file.type || getFileTypeFromName(file.name),
      fileSize: file.size
    };
    
    // Store the document
    userDocuments.push(document);
    
    // Save to localStorage for persistence
    saveDocumentsToLocalStorage();
    
    return document;
  } catch (error) {
    console.error("Error processing document:", error);
    return null;
  }
}

/**
 * Extract text from different file types
 */
async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type || getFileTypeFromName(file.name);
  
  // For text files, just read as text
  if (fileType.includes('text/plain')) {
    return readAsText(file);
  }
  
  // For PDFs, we would need a PDF parser library
  // In a real implementation, you would use a library like pdf.js or pdf-parse
  // For now, we'll just return a placeholder message
  if (fileType.includes('pdf')) {
    return readAsText(file); // In real app, replace with PDF extraction
  }
  
  // For Word documents (DOCX)
  if (fileType.includes('word') || fileType.includes('docx')) {
    return readAsText(file); // In real app, replace with DOCX extraction
  }
  
  // For other file types, try to read as text as a fallback
  return readAsText(file);
}

/**
 * Read file as text
 */
function readAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Extract potential tags from content
 */
function extractTags(content: string): string[] {
  // A simple tag extraction based on common keywords for placement/mental health context
  const commonTags = [
    "placement", "interview", "resume", "cv", "career", 
    "job", "stress", "anxiety", "wellbeing", "mental health",
    "college", "university", "skill", "rejection", "offer",
    "counseling", "preparation", "campus", "recruitment"
  ];
  
  const tags = commonTags.filter(tag => 
    content.toLowerCase().includes(tag.toLowerCase())
  );
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Guess file type from name if MIME type is not available
 */
function getFileTypeFromName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  if (!ext) return 'application/octet-stream';
  
  const typeMap: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'rtf': 'application/rtf',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
  
  return typeMap[ext] || 'application/octet-stream';
}

/**
 * Save documents to localStorage
 */
function saveDocumentsToLocalStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userDocuments));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Get all stored documents
 */
export function getAllDocuments(): UserDocument[] {
  return [...userDocuments];
}

/**
 * Delete a document by ID
 */
export function deleteDocument(id: string): boolean {
  const initialLength = userDocuments.length;
  userDocuments = userDocuments.filter(doc => doc.id !== id);
  
  if (userDocuments.length !== initialLength) {
    saveDocumentsToLocalStorage();
    return true;
  }
  
  return false;
}

/**
 * Find relevant content from custom documents based on a query
 */
export function findRelevantCustomContent(query: string): string {
  if (userDocuments.length === 0) {
    return "";
  }
  
  const queryLower = query.toLowerCase();
  
  // Simple keyword matching (in production, use embeddings and semantic search)
  const relevantDocs = userDocuments.filter(doc => {
    // Check if any tags match
    const tagMatch = doc.tags.some(tag => 
      queryLower.includes(tag.toLowerCase()) || 
      tag.toLowerCase().includes(queryLower)
    );
    
    // Check content for matches
    const contentMatch = doc.content.toLowerCase().includes(queryLower);
    
    return tagMatch || contentMatch;
  });
  
  if (relevantDocs.length > 0) {
    // Concatenate relevant document content
    // In production, you would use chunking and more sophisticated retrieval
    return relevantDocs.map(doc => 
      `From document "${doc.title}":\n${doc.content.substring(0, 1000)}${doc.content.length > 1000 ? '...' : ''}`
    ).join("\n\n");
  }
  
  return "";
}
