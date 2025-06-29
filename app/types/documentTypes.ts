// Types for document parsing and processing

export interface ParseResult {
  text: string;
  metadata?: {
    title?: string;
    author?: string;
    creationDate?: string;
    [key: string]: any;
  };
  error?: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  metadata?: Record<string, any>;
}
