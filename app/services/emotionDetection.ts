import { WellnessTool } from '../components/wellness/WellnessToolsConfig';

// Define emotion types and their corresponding keywords
export type EmotionType = 'anxiety' | 'stress' | 'sadness' | 'anger' | 'overwhelmed' | 'lonely' | 'tired' | 'grateful' | 'excited';

interface EmotionKeywords {
  [key: string]: {
    keywords: string[];
    tool: WellnessTool;
    buttonText: string;
    description: string;
  };
}

const emotionMap: EmotionKeywords = {
  anxiety: {
    keywords: [
      'anxious', 'anxiety', 'worried', 'nervous', 'panic', 'panicking', 'scared', 'afraid',
      'fear', 'fearful', 'restless', 'uneasy', 'tense', 'on edge', 'jittery', 'butterflies',
      'racing heart', 'can\'t breathe', 'short of breath', 'hyperventilating', 'sweating',
      'shaking', 'trembling', 'racing thoughts', 'what if', 'catastrophizing'
    ],
    tool: 'breathing',
    buttonText: 'Try Breathing Exercise',
    description: 'Calm your mind with guided breathing'
  },
  stress: {
    keywords: [
      'stressed', 'stress', 'overwhelming', 'overwhelmed', 'pressure', 'pressured',
      'burned out', 'burnout', 'exhausted', 'overloaded', 'too much', 'can\'t handle',
      'breaking point', 'at my limit', 'frazzled', 'stretched thin', 'juggling too much',
      'deadline', 'deadlines', 'workload', 'demanding'
    ],
    tool: 'breathing',
    buttonText: 'Try Breathing Exercise',
    description: 'Find calm in the chaos'
  },
  sadness: {
    keywords: [
      'sad', 'sadness', 'down', 'blue', 'depressed', 'depression', 'low', 'empty',
      'hollow', 'numb', 'crying', 'tears', 'tearful', 'heartbroken', 'hurt', 'pain',
      'grief', 'grieving', 'loss', 'mourning', 'melancholy', 'gloomy', 'miserable',
      'defeated', 'broken'
    ],
    tool: 'affirmations',
    buttonText: 'View Uplifting Affirmations',
    description: 'Gentle reminders of your worth and strength'
  },
  anger: {
    keywords: [
      'angry', 'anger', 'mad', 'furious', 'rage', 'raging', 'pissed', 'frustrated',
      'frustration', 'irritated', 'annoyed', 'livid', 'seething', 'boiling', 'fuming',
      'outraged', 'resentful', 'bitter', 'hostile', 'aggressive', 'explosive'
    ],
    tool: 'grounding',
    buttonText: 'Try Grounding Technique',
    description: 'Ground yourself and find emotional balance'
  },
  overwhelmed: {
    keywords: [
      'overwhelmed', 'overwhelming', 'too much', 'drowning', 'suffocating', 'chaos',
      'chaotic', 'scattered', 'all over the place', 'can\'t focus', 'spiraling',
      'out of control', 'losing it', 'falling apart', 'breaking down'
    ],
    tool: 'grounding',
    buttonText: 'Try Grounding Technique',
    description: 'Center yourself and regain control'
  },
  lonely: {
    keywords: [
      'lonely', 'loneliness', 'alone', 'isolated', 'disconnected', 'abandoned',
      'forgotten', 'invisible', 'nobody cares', 'no one understands', 'by myself',
      'solitary', 'cut off', 'excluded', 'left out'
    ],
    tool: 'journal',
    buttonText: 'Try Journal Prompt',
    description: 'Express your thoughts and feelings'
  },
  tired: {
    keywords: [
      'tired', 'exhausted', 'drained', 'worn out', 'fatigued', 'weary', 'sleepy',
      'drowsy', 'lethargic', 'sluggish', 'spent', 'wiped out', 'running on empty',
      'no energy', 'can\'t keep up'
    ],
    tool: 'sounds',
    buttonText: 'Listen to Calming Sounds',
    description: 'Relax and restore your energy'
  },
  grateful: {
    keywords: [
      'grateful', 'thankful', 'blessed', 'appreciate', 'appreciation', 'fortunate',
      'lucky', 'counting blessings', 'grateful for', 'thank you', 'thankfulness'
    ],
    tool: 'affirmations',
    buttonText: 'View Positive Affirmations',
    description: 'Celebrate your gratitude and positivity'
  },
  excited: {
    keywords: [
      'excited', 'enthusiasm', 'enthusiastic', 'thrilled', 'elated', 'overjoyed',
      'happy', 'joyful', 'ecstatic', 'pumped', 'energized', 'motivated', 'inspired'
    ],
    tool: 'affirmations',
    buttonText: 'View Positive Affirmations',
    description: 'Amplify your positive energy'
  }
};

export interface DetectedEmotion {
  emotion: EmotionType;
  confidence: number;
  tool: WellnessTool;
  buttonText: string;
  description: string;
}

export function detectEmotions(message: string): DetectedEmotion[] {
  const lowercaseMessage = message.toLowerCase();
  const detectedEmotions: DetectedEmotion[] = [];

  // Check each emotion type
  Object.entries(emotionMap).forEach(([emotionType, config]) => {
    const matchedKeywords = config.keywords.filter(keyword =>
      lowercaseMessage.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      // Calculate confidence based on number of matched keywords and message length
      const confidence = Math.min(
        (matchedKeywords.length / config.keywords.length) * 100,
        (matchedKeywords.length / message.split(' ').length) * 100
      );

      detectedEmotions.push({
        emotion: emotionType as EmotionType,
        confidence,
        tool: config.tool,
        buttonText: config.buttonText,
        description: config.description
      });
    }
  });

  // Sort by confidence and return top emotions
  return detectedEmotions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 2); // Return max 2 emotions to avoid cluttering
}

export function getEmotionBasedSuggestions(message: string): DetectedEmotion[] {
  const emotions = detectEmotions(message);

  // Filter out duplicate tools and low-confidence detections
  const uniqueTools = new Set<WellnessTool>();
  return emotions.filter(emotion => {
    if (emotion.confidence < 10 || uniqueTools.has(emotion.tool)) {
      return false;
    }
    uniqueTools.add(emotion.tool);
    return true;
  });
}
