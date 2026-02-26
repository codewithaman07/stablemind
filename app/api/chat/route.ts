import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { detectCrisis, mentalHealthHelplines } from '../../services/crisisDetection';
import { getEmotionBasedSuggestions } from '../../services/emotionDetection';
import { retrieveRelevantContent } from '../../services/ragService';
import { rateLimit } from '../../lib/rate-limit';
import { auth } from '@clerk/nextjs/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are StableMind, a motivational chatbot built for students going through the stressful placement season. Respond like a helpful big brother or senior who has been through the placement process and succeeded. Be kind but straightforward with no sugarcoating - provide honest, actionable advice.

IMPORTANT IDENTITY INSTRUCTIONS:
- If asked who created you or who you are, NEVER mention being created by Google, being an AI, an LLM, or a language model.
- Instead, respond as "I'm StableMind, your placement companion. I'm here to support you through your placement journey with advice based on real experiences."
- Always maintain your identity as a supportive human mentor/senior who's been through placement season.

EMOTION DETECTION & WELLNESS TOOLS - MANDATORY REQUIREMENT:
- ALWAYS analyze the user's emotional state from their message
- IF the user seems distressed, anxious, sad, angry, overwhelmed, tired, lonely, or experiencing any negative emotion, you MUST suggest at least one specific wellness tool from the WELLNESS TOOLS AVAILABLE section above
- You MUST provide clear, step-by-step instructions on how to access these tools - this is not optional
- Make the suggestions feel natural and caring, like a friend would suggest an activity to help
- REQUIREMENT: Every response to emotional distress MUST include a wellness tool suggestion with access instructions
- Example: "I can sense you're feeling really anxious about this. Here's something that can help you feel calmer right now: Look for the Tools panel on the right side of your screen (it has a 🔧 icon) and click on 'Breathing Exercise'. This will guide you through a calming breathing technique that many students find really helpful during stressful times."
- MANDATORY: If you detect ANY negative emotions (anxiety, stress, sadness, anger, overwhelm, tiredness, loneliness), you MUST mention at least one wellness tool activity available on the website and provide access instructions.

Keep conversations flowing naturally like a real person would - avoid structured formats that sound robotic. Your responses should feel like genuine advice from a supportive friend who's experienced placement success.

Include specific placement-related advice where applicable (interview tips, resume guidance, rejection handling, etc.).

You can end your response with a motivational quote or encouraging thought when it feels natural and appropriate - but don't force quotes into every response. Only include quotes when they genuinely add value to the conversation.

Keep the tone:
- Like a supportive older sibling or senior who's "been there, done that"
- Empathetic but not coddling
- Honest without being harsh
- Genuinely encouraging without empty platitudes

Keep your responses concise - around 2-3 short paragraphs maximum.

Important: Format your response properly using simple HTML tags (<b> for bold, <i> for italic, <br/> for line breaks) 
instead of markdown syntax, as the text will be rendered as HTML.`;

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
        const identifier = userId ?? ip;

        const { success } = rateLimit(identifier, 10, 60 * 1000); // 10 requests per minute
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const { message, chatHistory = [] } = await req.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Using gemini-2.0-flash for low-latency chat responses (~1-3s vs 5-20s with reasoning models)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const isCrisisMessage = detectCrisis(message);
        const detectedEmotions = getEmotionBasedSuggestions(message);

        // Build wellness tool suggestions
        let wellnessToolsSuggestion = '';
        if (detectedEmotions.length > 0) {
            wellnessToolsSuggestion = `

WELLNESS TOOLS AVAILABLE:
The user seems to be experiencing ${detectedEmotions.map(e => e.emotion).join(' and/or ')}. You have access to these wellness tools that can help:

${detectedEmotions.map(emotion => `
- ${emotion.buttonText}: ${emotion.description}
  Access: Go to the Tools panel (🔧) on the right side of the screen, or visit /wellness page, then click "${emotion.buttonText.replace('Try ', '').replace('View ', '').replace('Listen to ', '')}"
`).join('')}

IMPORTANT: When suggesting these tools, provide specific step-by-step directions on how to access them.
Make these suggestions feel natural and supportive, not robotic or clinical.`;
        }

        // Format recent chat history (limit to last 10 messages)
        const recentMessages = chatHistory.length > 10 ? chatHistory.slice(-10) : chatHistory;
        const formattedChatHistory = recentMessages
            .filter((msg: { role: string; content: string }) => msg.role === 'user' || msg.role === 'bot')
            .map((msg: { role: string; content: string }) => {
                const cleanContent = msg.role === 'bot'
                    ? msg.content.replace(/<[^>]*>/g, '')
                    : msg.content;
                return `${msg.role === 'user' ? 'User' : 'StableMind'}: ${cleanContent}`;
            })
            .join('\n\n');

        // Retrieve relevant context via RAG
        const context = retrieveRelevantContent(message);
        const hasContext = context && context !== 'No specific context found in knowledge base.';

        const prompt = `
Previous conversation (for context, use this to maintain consistency in your responses):
${formattedChatHistory}

${hasContext ? `Context information from custom and built-in knowledge sources:\n${context}\n` : ''}
${wellnessToolsSuggestion}

User's latest message: ${message}

${SYSTEM_PROMPT}

${hasContext ? `First, analyze if any of the provided context is relevant to the user's question. 
If it is, use this context to enhance your response, but don't explicitly mention where the information comes from.
Please respond based on the relevant context and your knowledge about placement stress and mental wellbeing.` : `When appropriate, suggest calming techniques like breathing exercises, meditation, or journaling.`}

${isCrisisMessage ? 'IMPORTANT: This seems like a crisis situation. Begin your response by empathetically acknowledging their feelings, and then IMMEDIATELY provide the mental health helpline information at the end of your response.' : ''}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let responseText = response.text();

        // Append crisis helplines if needed
        if (isCrisisMessage) {
            if (!responseText.includes('Mental Health Helpline')) {
                responseText += `<div class="important-crisis-notice">${mentalHealthHelplines}</div>`;
            }
            if (!responseText.includes('professional help') && !responseText.includes('seek help')) {
                responseText += `<br/><br/><b>Important:</b> Please consider speaking with a mental health professional. The helplines above are available 24/7 and staffed by trained counselors who understand what you're going through.`;
            }
        }

        return NextResponse.json({
            response: responseText,
            isCrisis: isCrisisMessage,
            detectedEmotions,
        });
    } catch (error) {
        console.error('Chat API Error:', error);

        const message = (await (async () => {
            try {
                const body = await req.clone().json();
                return body.message || '';
            } catch {
                return '';
            }
        })());

        if (detectCrisis(message)) {
            return NextResponse.json({
                response: `<div class="crisis-error-response">
          <p>I'm having trouble connecting right now, but I noticed your message contains concerning content.</p>
          <p><b>Your wellbeing is the top priority right now.</b></p>
          <p>Please reach out to one of these helplines immediately:</p>
          ${mentalHealthHelplines}
        </div>`,
                isCrisis: true,
                detectedEmotions: [],
            });
        }

        return NextResponse.json({
            response: "I'm having trouble connecting right now. Please try again in a moment.",
            isCrisis: false,
            detectedEmotions: [],
        }, { status: 500 });
    }
}
