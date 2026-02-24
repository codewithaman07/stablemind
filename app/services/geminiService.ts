"use client";

/**
 * Client-side wrapper that calls the server-side /api/chat route.
 * This keeps the API key server-only while allowing components
 * like DailyAffirmations and JournalPrompt to still use chatWithGemini().
 */
export async function chatWithGemini(
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: string = "",
  chatHistory: { role: string; content: string }[] = []
): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, chatHistory }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to get response");
    }

    return data.response;
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
