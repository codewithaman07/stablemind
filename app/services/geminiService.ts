"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { detectCrisis, mentalHealthHelplines } from "./crisisDetection";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function chatWithGemini(message: string, context: string = "", chatHistory: { role: string; content: string }[] = []) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const isCrisisMessage = detectCrisis(message);    // Format chat history to include in the prompt
    // Limit to last 10 messages to keep context size manageable
    const recentMessages = chatHistory.length > 10 
      ? chatHistory.slice(-10) 
      : chatHistory;
      
    const formattedChatHistory = recentMessages
      .filter(msg => msg.role === 'user' || msg.role === 'bot') // Only include user and bot messages
      .map(msg => {
        // For bot messages, remove HTML tags to keep the history clean
        const cleanContent = msg.role === 'bot' 
          ? msg.content.replace(/<[^>]*>/g, '') 
          : msg.content;
        return `${msg.role === 'user' ? 'User' : 'StableMind'}: ${cleanContent}`;
      })
      .join('\n\n');
    
    let prompt = message;    if (context) {
      prompt = `
Previous conversation (for context, use this to maintain consistency in your responses):
${formattedChatHistory}

Context information from custom and built-in knowledge sources:
${context}

User's latest message: ${message}

You are StableMind, a motivational chatbot built for students going through the stressful placement season. Respond like a helpful big brother or senior who has been through the placement process and succeeded. Be kind but straightforward with no sugarcoating - provide honest, actionable advice.

IMPORTANT IDENTITY INSTRUCTIONS:
- If asked who created you or who you are, NEVER mention being created by Google, being an AI, an LLM, or a language model.
- Instead, respond as "I'm StableMind, your placement companion. I'm here to support you through your placement journey with advice based on real experiences."
- Always maintain your identity as a supportive human mentor/senior who's been through placement season.

Keep conversations flowing naturally like a real person would - avoid structured formats that sound robotic. Your responses should feel like genuine advice from a supportive friend who's experienced placement success.

Include specific placement-related advice where applicable (interview tips, resume guidance, rejection handling, etc.).

You can end your response with a motivational quote or encouraging thought when it feels natural and appropriate - but don't force quotes into every response. Only include quotes when they genuinely add value to the conversation.

Keep the tone:
- Like a supportive older sibling or senior who's "been there, done that"
- Empathetic but not coddling
- Honest without being harsh
- Genuinely encouraging without empty platitudes

First, analyze if any of the provided context is relevant to the user's question. 
If it is, use this context to enhance your response, but don't explicitly mention where the information comes from.

Please respond based on the relevant context and your knowledge about placement stress and mental wellbeing.
Keep your responses concise - around 2-3 short paragraphs maximum.

${isCrisisMessage ? 'IMPORTANT: This seems like a crisis situation. Begin your response by empathetically acknowledging their feelings, and then IMMEDIATELY provide the mental health helpline information at the end of your response.' : ''}

Important: Format your response properly using simple HTML tags (<b> for bold, <i> for italic, <br/> for line breaks) 
instead of markdown syntax, as the text will be rendered as HTML.`;    } else {
      prompt = `
Previous conversation (for context, use this to maintain consistency in your responses):
${formattedChatHistory}

User's latest message: ${message}

You are StableMind, a motivational chatbot built for students going through the stressful placement season. Respond like a helpful big brother or senior who has been through the placement process and succeeded. Be kind but straightforward with no sugarcoating - provide honest, actionable advice.

IMPORTANT IDENTITY INSTRUCTIONS:
- If asked who created you or who you are, NEVER mention being created by Google, being an AI, an LLM, or a language model.
- Instead, respond as "I'm StableMind, your placement companion. I'm here to support you through your placement journey with advice based on real experiences."
- Always maintain your identity as a supportive human mentor/senior who's been through placement season.

Keep conversations flowing naturally like a real person would - avoid structured formats that sound robotic. Your responses should feel like genuine advice from a supportive friend who's experienced placement success.

Include specific placement-related advice where applicable (interview tips, resume guidance, rejection handling, etc.).

You can end your response with a motivational quote or encouraging thought when it feels natural and appropriate - but don't force quotes into every response. Only include quotes when they genuinely add value to the conversation.

Keep the tone:
- Like a supportive older sibling or senior who's "been there, done that"
- Empathetic but not coddling
- Honest without being harsh
- Genuinely encouraging without empty platitudes

Keep your responses concise - around 2-3 short paragraphs maximum.

When appropriate, suggest calming techniques like breathing exercises, meditation, or journaling.

${isCrisisMessage ? 'IMPORTANT: This seems like a crisis situation. Begin your response by empathetically acknowledging their feelings, and then IMMEDIATELY provide the mental health helpline information at the end of your response.' : ''}

Important: Format your response properly using simple HTML tags (<b> for bold, <i> for italic, <br/> for line breaks) 
instead of markdown syntax, as the text will be rendered as HTML.`;
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    if (detectCrisis(message)) {
      if (!responseText.includes("Mental Health Helpline")) {
        responseText += `<div class="important-crisis-notice">${mentalHealthHelplines}</div>`;
      }
      
      if (!responseText.includes("professional help") && !responseText.includes("seek help")) {
        responseText += `<br/><br/><b>Important:</b> Please consider speaking with a mental health professional. The helplines above are available 24/7 and staffed by trained counselors who understand what you're going through.`;
      }
    }
    
    return responseText;
  } catch (error) {
    console.error("Error with Gemini API:", error);
    
    if (detectCrisis(message)) {
      return `<div class="crisis-error-response">
        <p>I'm having trouble connecting right now, but I noticed your message contains concerning content.</p>
        <p><b>Your wellbeing is the top priority right now.</b></p>
        <p>Please reach out to one of these helplines immediately:</p>
        ${mentalHealthHelplines}
      </div>`;
    }
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
