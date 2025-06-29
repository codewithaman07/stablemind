"use client";

import { findRelevantCustomContent } from './documentService';

// This is a simplified version. For production, you would use a vector DB like Pinecone or Supabase
const placementResources = [
  {
    id: "resume-tips",
    content: "Effective resumes highlight relevant skills and quantify achievements. Keep it concise and tailor it to each application. Use action verbs like 'achieved', 'led', 'implemented' rather than passive language. Highlight projects relevant to the role you're applying for. Include metrics when possible - instead of 'increased sales', say 'increased sales by 27% over 6 months'.",
    tags: ["resume", "application", "cv", "job application"]
  },
  {
    id: "interview-prep",
    content: "Prepare for behavioral and technical interviews. Research the company, practice common questions, and prepare your own questions. For technical roles, review fundamental concepts and practice problem-solving aloud. For behavioral questions, use the STAR method (Situation, Task, Action, Result) to structure your responses. Always have 2-3 questions prepared to ask the interviewer about the company culture, team dynamics, or growth opportunities.",
    tags: ["interview", "preparation", "questions", "behavioral interview", "technical interview"]
  },
  {
    id: "rejection-coping",
    content: "Rejection is part of the process, not a reflection of your worth. Use feedback constructively and maintain perspective. Remember that even highly qualified candidates face rejection - it's often about fit, timing, and factors beyond your control. Take time to process your emotions, then review any feedback objectively. Consider each application a learning experience that improves your chances for the next opportunity. Maintain a support network of friends, family, or mentors who can offer encouragement during challenging times.",
    tags: ["rejection", "mental health", "coping", "feedback", "emotional management"]
  },
  {
    id: "stress-management",
    content: "Manage placement stress through regular exercise, adequate sleep, mindfulness practices, and maintaining social connections. Break down the job search into smaller, manageable tasks rather than viewing it as one overwhelming goal. Schedule specific times for applications and interviews, but also protect time for rest and activities you enjoy. Practice deep breathing exercises when anxiety spikes. Remember that your career is a marathon, not a sprint - maintaining your wellbeing is crucial for long-term success.",
    tags: ["stress", "anxiety", "mental health", "wellbeing", "burnout prevention"]
  },
  {
    id: "comparison-trap",
    content: "Avoid comparing your journey to others. Each person's career path is unique, with different strengths, opportunities, and timing. When peers secure positions before you, congratulate them while recognizing that their success doesn't diminish your potential. Focus on your personal growth and progress rather than external benchmarks. Set goals based on your specific situation and celebrate your own milestones, however small. Remember that social media and casual conversations often highlight only successes, not the struggles and rejections that everyone faces.",
    tags: ["comparison", "social pressure", "peer pressure", "self-worth", "career path"]
  },
  {
    id: "placement-perspective",
    content: "Your first job is just the beginning of your career, not its definition. Many successful professionals start in positions unrelated to their eventual career path. Focus on gaining transferable skills and building professional relationships rather than finding the 'perfect' first role. Seek opportunities to learn and grow, even in unexpected places. Consider each role as a stepping stone that provides experience, connections, and clearer insights into your professional interests and strengths.",
    tags: ["first job", "career perspective", "professional development", "career journey"]
  },
  {
    id: "self-care-practices",
    content: "Prioritize self-care during the placement season. Maintain regular physical activity, even if it's just a 20-minute daily walk. Ensure adequate sleep (7-8 hours) to support cognitive function and emotional regulation. Practice mindfulness through breathing exercises, meditation, or journaling to manage racing thoughts. Maintain social connections and be willing to share your experiences with trusted friends or family. Set boundaries around job search activities - designate specific times for applications and interviews rather than letting them consume all your waking hours.",
    tags: ["self-care", "wellbeing", "mental health", "physical health", "boundaries"]
  },
  {
    id: "skill-development",
    content: "Use the placement period to continue developing relevant skills. Identify gaps in your knowledge or experience related to your target roles. Consider online courses, certifications, or volunteer opportunities to strengthen your profile. Work on projects that demonstrate your abilities and can be discussed in interviews. Join industry-related online communities or forums to stay current with trends and build your network. Remember that continuously improving your skills not only enhances your employability but also builds confidence during the job search process.",
    tags: ["skills", "learning", "professional development", "courses", "certifications"]
  }
];

export async function retrieveRelevantContent(query: string): Promise<string> {
  // Convert query to lowercase for case-insensitive matching
  const queryLower = query.toLowerCase();
  
  // First, check for relevant content in user's custom documents
  const customContent = findRelevantCustomContent(query);
  
  // Simple keyword matching (in production, use embeddings and semantic search)
  const relevantResources = placementResources.filter(resource => {
    // Check if any tags match the query keywords
    const tagMatch = resource.tags.some(tag => queryLower.includes(tag));
    // Check if content contains query keywords
    const contentMatch = resource.content.toLowerCase().includes(queryLower);
    
    return tagMatch || contentMatch;
  });
  
  // Combine content from both sources
  let combinedContent = '';
  
  // Add custom document content if available
  if (customContent) {
    combinedContent += "## From your uploaded documents:\n" + customContent + "\n\n";
  }
  
  // Add built-in resources if available
  if (relevantResources.length > 0) {
    combinedContent += "## From StableMind knowledge base:\n" + 
                      relevantResources.map(r => r.content).join("\n\n");
  }
  
  return combinedContent || ""; // Return combined content or empty string
}
