"use client";

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
  },
  {
    id: "anxiety-support",
    content: "Anxiety is a normal response to uncertainty, but it doesn't have to control your life. When anxiety strikes, try the 4-7-8 breathing technique: breathe in for 4 counts, hold for 7, exhale for 8. This activates your body's relaxation response. Ground yourself by naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Remember that anxious thoughts are not facts - they're your mind trying to protect you. Challenge catastrophic thinking by asking: 'What evidence do I have for this thought?' and 'What would I tell a friend in this situation?'",
    tags: ["anxiety", "anxious", "worried", "nervous", "panic", "breathing", "grounding", "calm"]
  },
  {
    id: "sadness-support",
    content: "Feeling sad is a natural part of the human experience. It's okay to sit with these feelings rather than trying to immediately fix them. Sadness often signals that something important to you has been affected. Allow yourself to feel without judgment. Gentle activities like journaling, listening to music, or spending time in nature can help. Remember that emotions are temporary - this feeling will pass. Reach out to trusted friends or family when you're ready. Sometimes just naming your feelings to someone who cares can provide comfort and perspective.",
    tags: ["sad", "sadness", "down", "blue", "depressed", "low", "empty", "crying", "hurt", "grief"]
  },
  {
    id: "anger-management",
    content: "Anger is a valid emotion that often signals when our boundaries have been crossed or our values challenged. The key is expressing anger constructively rather than destructively. When you feel anger rising, pause and take deep breaths. Try to identify what's underneath the anger - often it's hurt, fear, or frustration. Physical activity like going for a walk or doing jumping jacks can help discharge the energy. Write about your feelings or talk to someone you trust. Remember that you can acknowledge your anger without acting on it impulsively.",
    tags: ["angry", "anger", "mad", "furious", "frustrated", "irritated", "rage", "resentful", "hostile"]
  },
  {
    id: "overwhelm-support",
    content: "Feeling overwhelmed happens when we perceive that our demands exceed our resources. Start by taking three deep breaths and reminding yourself that this feeling is temporary. Break down overwhelming tasks into smaller, manageable steps. Write them down if it helps - getting things out of your head and onto paper can provide immediate relief. Focus on just the next small step, not the entire mountain. It's okay to ask for help or delegate when possible. Remember: you don't have to do everything perfectly or all at once.",
    tags: ["overwhelmed", "overwhelming", "too much", "drowning", "chaos", "scattered", "spiraling", "out of control"]
  },
  {
    id: "loneliness-support",
    content: "Loneliness is the feeling of being disconnected from others, and it's more common than you might think. Even in a crowd, we can feel lonely if we don't feel understood or valued. Start small - reach out to one person today, even if it's just a simple text. Consider joining groups or activities that align with your interests. Volunteering can be a wonderful way to connect while helping others. Remember that quality connections matter more than quantity. Be patient with yourself as you build or rebuild social connections.",
    tags: ["lonely", "loneliness", "alone", "isolated", "disconnected", "abandoned", "nobody cares", "forgotten"]
  },
  {
    id: "gratitude-practice",
    content: "Gratitude is a powerful practice that can shift your perspective and improve your mood. It's not about ignoring difficulties, but about noticing the good that coexists with challenges. Start by identifying three specific things you're grateful for today - they can be small, like a warm cup of coffee or a kind gesture from a friend. Try to be specific rather than general. Research shows that regular gratitude practice can improve sleep, relationships, and overall well-being. Consider keeping a gratitude journal or sharing your appreciation with others.",
    tags: ["grateful", "thankful", "blessed", "appreciate", "appreciation", "fortunate", "counting blessings"]
  }
];

export async function retrieveRelevantContent(query: string): Promise<string> {
  // Convert query to lowercase for case-insensitive matching
  const queryLower = query.toLowerCase();
  
  // Simple keyword matching (in production, use embeddings and semantic search)
  const relevantResources = placementResources.filter(resource => {
    // Check if any tags match the query keywords
    const tagMatch = resource.tags.some(tag => queryLower.includes(tag));
    // Check if content contains query keywords
    const contentMatch = resource.content.toLowerCase().includes(queryLower);
    
    return tagMatch || contentMatch;
  });
  
  // Combine content from relevant resources
  let combinedContent = '';
  
  // Add built-in resources if available
  if (relevantResources.length > 0) {
    combinedContent += "## From StableMind knowledge base:\n" + 
                      relevantResources.map(r => r.content).join("\n\n");
  }
  
  return combinedContent || ""; // Return combined content or empty string
}
