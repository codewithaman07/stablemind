"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import vectorDB from './vector_database.json';

interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
}

class RAGService {
  private genAI: GoogleGenerativeAI;
  private vectorDocuments: VectorDocument[];

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.vectorDocuments = vectorDB as VectorDocument[];
  }

// using cosine similarity  
  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA.length || !vecB.length || vecA.length !== vecB.length) return 0;
    
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  private generateEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    
    words.forEach((word, index) => {
      for (let i = 0; i < word.length; i++) {
        const charCode = word.charCodeAt(i);
        const position = (index * word.length + i) % 384;
        embedding[position] += charCode / 1000;
      }
    });
    
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? embedding.map(val => val / magnitude) : embedding;
  }

  private retrieveRelevantDocs(query: string, topK: number = 3): VectorDocument[] {
    const queryEmbedding = this.generateEmbedding(query);
    
    const scoredDocs = this.vectorDocuments
      .filter(doc => doc.embedding && doc.embedding.length > 0)
      .map(doc => ({
        doc,
        score: this.cosineSimilarity(queryEmbedding, doc.embedding)
      }));

    return scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(item => item.doc);
  }

  async query(userQuery: string, conversationHistory: Array<{ role: string; content: string }> = []): Promise<string> {
    try {
      const relevantDocs = this.retrieveRelevantDocs(userQuery, 3);
      
      const context = relevantDocs
        .map((doc, idx) => `[Context ${idx + 1}]\n${doc.content}`)
        .join('\n\n');

      const systemPrompt = `You are a compassionate mental health support AI assistant specializing in helping with anxiety, depression, and overall wellness.

KNOWLEDGE BASE CONTEXT:
${context}

GUIDELINES:
- Provide supportive, evidence-based advice using the knowledge base
- Be empathetic, non-judgmental, and encouraging
- If the knowledge base doesn't contain relevant information, provide general supportive guidance
- Always encourage professional help for serious mental health concerns
- Focus on practical coping strategies and self-care techniques
- Acknowledge the user's feelings and validate their experiences

Please respond to the user's question with compassion and helpful information.`;

      const conversationContext = conversationHistory
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      const fullPrompt = `${systemPrompt}\n\n${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}User: ${userQuery}\n\nAssistant:`;

      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('RAG Service Error:', error);
      throw new Error('Failed to process query. Please try again.');
    }
  }

  searchByKeyword(keyword: string): VectorDocument[] {
    const lowerKeyword = keyword.toLowerCase();
    return this.vectorDocuments.filter(doc => 
      doc.content.toLowerCase().includes(lowerKeyword)
    );
  }

  getRandomTip(): string {
    const randomIndex = Math.floor(Math.random() * this.vectorDocuments.length);
    return this.vectorDocuments[randomIndex]?.content || "Take a deep breath and be kind to yourself.";
  }

  getDocumentCount(): number {
    return this.vectorDocuments.length;
  }

  // Retrieve relevant content as string (for integration with other services)
  retrieveRelevantContent(query: string, topK: number = 3): string {
    const relevantDocs = this.retrieveRelevantDocs(query, topK);
    
    if (relevantDocs.length === 0) {
      return "No specific context found in knowledge base.";
    }
    
    return relevantDocs
      .map((doc, idx) => `[Context ${idx + 1}]\n${doc.content}`)
      .join('\n\n');
  }
}

export const ragService = new RAGService();

export async function retrieveRelevantContent(query: string): Promise<string> {
  return ragService.retrieveRelevantContent(query);
}