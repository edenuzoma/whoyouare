// ── AI Service ────────────────────────────────────────────────────────────────
// Groq is FREE — get key at console.groq.com (no credit card needed)
// Add to .env: VITE_GROQ_API_KEY=your_key_here

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const DEEPSEEK_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

async function callAI(prompt: string, maxTokens = 1200): Promise<string> {
  // Try Groq first — use the larger more capable model
  if (GROQ_KEY) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a behavioral psychologist. You ONLY output valid raw JSON objects. No markdown. No backticks. No explanation. No text before or after the JSON. Just the JSON object starting with { and ending with }.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.85,
          response_format: { type: "json_object" },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content ?? "";
        if (text) {
          console.log("Groq response received, length:", text.length);
          return text;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn("Groq failed:", res.status, errData?.error?.message);
      }
    } catch (err) {
      console.warn("Groq network error:", err);
    }
  }

  // Fallback: DeepSeek
  if (DEEPSEEK_KEY) {
    try {
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DEEPSEEK_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a behavioral psychologist. You ONLY output valid raw JSON objects. No markdown. No backticks. No explanation. Just the JSON.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: maxTokens,
          temperature: 0.85,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content ?? "";
        if (text) return text;
      } else {
        const errText = await res.text();
        console.warn("DeepSeek failed:", res.status, errText);
      }
    } catch (err) {
      console.warn("DeepSeek error:", err);
    }
  }

  throw new Error("No AI provider available. Add VITE_GROQ_API_KEY to your .env file (free at console.groq.com).");
}

function extractJSON<T>(raw: string, fallback: T): T {
  try {
    // First try direct parse
    const direct = JSON.parse(raw.trim());
    if (direct && typeof direct === "object") return direct as T;
  } catch {}

  try {
    // Strip markdown fences
    const stripped = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(stripped);
    if (parsed && typeof parsed === "object") return parsed as T;
  } catch {}

  try {
    // Find first { to last }
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const parsed = JSON.parse(raw.slice(start, end + 1));
      if (parsed && typeof parsed === "object") return parsed as T;
    }
  } catch {}

  console.error("All JSON parse attempts failed. Raw response:", raw.slice(0, 300));
  return fallback;
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface GeminiAnalysis {
  firstName: string;
  fullName: string;
  archetype: string;
  deepRead: string;
  traits: { title: string; score: number; headline: string; detail: string }[];
  superPowers: { emoji: string; title: string; description: string }[];
  thingsToTry: { emoji: string; title: string; description: string; tip: string }[];
  funTopics: { emoji: string; topic: string; color: string }[];
}

export interface JournalAnalysis {
  emotionalState: string;
  emotionalScore: number;
  theme: string;
  insights: string[];
  recommendations: string[];
  affirmation: string;
}

// ── Fallback ──────────────────────────────────────────────────────────────────
function getFallback(firstName: string, fullName: string): GeminiAnalysis {
  return {
    firstName,
    fullName,
    archetype: "The Quiet Powerhouse",
    deepRead: `**You carry more than people see.** There is a version of you that thinks deeply, notices things others miss, and feels things more intensely than you let on. That is not a weakness — that is your edge.\n\n**You have been building quietly, and it shows.** The way you show up online tells a story of someone who wants to say something real, not just make noise. That takes genuine courage.\n\n**The best of you is still ahead.** Keep going — not because it is easy, but because the world genuinely needs the specific thing only you can bring.`,
    traits: [
      { title: "How You Express Yourself", score: 81, headline: "You say a lot with a little.", detail: "You choose your words carefully — like someone who knows the right sentence can change everything." },
      { title: "How You Think and Process", score: 77, headline: "You see what others walk past.", detail: "Your mind connects dots in unusual ways, like finding a hidden path in a forest everyone else thought was just trees." },
      { title: "How You Show Up For Others", score: 73, headline: "People feel safer around you.", detail: "There is something about you that makes people want to open up — like a warm room everyone wants to step into." },
      { title: "How You Chase What Matters", score: 85, headline: "You finish the things that count.", detail: "When something truly matters to you, you do not stop — like a river that finds its way around every rock." },
    ],
    superPowers: [
      { emoji: "🔍", title: "Pattern Spotter", description: "You notice what others miss — like finding the one piece that makes the whole puzzle suddenly make sense." },
      { emoji: "💬", title: "Honest Voice", description: "When you speak, people actually listen — not because you are loud, but because what you say means something." },
      { emoji: "🧭", title: "Inner Compass", description: "You have a strong sense of what is right for you — like a built-in GPS that never loses signal." },
      { emoji: "🌱", title: "Slow Burn Builder", description: "You build things that last — not the flashiest, but the kind still standing when everything else has fallen." },
    ],
    thingsToTry: [
      { emoji: "🎤", title: "Say it out loud more", description: "The thoughts you keep to yourself are often the ones other people most need to hear.", tip: "Share one honest opinion this week in a post or conversation." },
      { emoji: "🤝", title: "Let people in a little more", description: "Your depth is your gift — but it only helps others if you let them close enough to feel it.", tip: "Reply to someone this week with more than you usually would." },
      { emoji: "📖", title: "Document your journey", description: "You are living a story worth telling — and future you will thank present you for writing it down.", tip: "Write 3 sentences today about where you are and where you are headed." },
    ],
    funTopics: [
      { emoji: "🧠", topic: "The Psychology of Deep Thinkers", color: "bg-purple-100 text-purple-700" },
      { emoji: "🌊", topic: "Building Depth in a Shallow World", color: "bg-blue-100 text-blue-700" },
      { emoji: "🔥", topic: "How Quiet People Change Things", color: "bg-orange-100 text-orange-700" },
      { emoji: "❤️", topic: "Emotional Intelligence at Work", color: "bg-red-100 text-red-700" },
      { emoji: "🎯", topic: "Doing Less But Meaning More", color: "bg-green-100 text-green-700" },
      { emoji: "✨", topic: "Finding Your Unique Voice Online", color: "bg-yellow-100 text-yellow-700" },
    ],
  };
}

function extractNameFromUrl(profileUrl: string): { firstName: string; fullName: string } {
  try {
    const url = new URL(profileUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    const slug = parts[parts.length - 1] || "";
    const clean = slug.replace(/[-_]/g, " ").trim();
    const words = clean.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    return { firstName: words[0] || "You", fullName: words.join(" ") || "You" };
  } catch {
    return { firstName: "You", fullName: "You" };
  }
}

// ── Profile Analysis ──────────────────────────────────────────────────────────
export async function analyzeProfile(profileUrl: string, profileType: string): Promise<GeminiAnalysis> {
  const platform = profileType === "linkedin" ? "LinkedIn" : "X (Twitter)";
  const { firstName, fullName } = extractNameFromUrl(profileUrl);
  const fallback = getFallback(firstName, fullName);

  const prompt = `Analyze this ${platform} profile and write a behavioral psychology analysis.

Profile URL: ${profileUrl}
Person: ${firstName} (full name: ${fullName})

Write EVERYTHING directly TO this person. Use "you" and "your" only. NEVER say "${firstName} is" or "he is" or "she is" or "this person". Always say "You are" or "You have".

Return a JSON object with exactly these fields. Keep all string values concise (1-3 sentences max):

{
  "archetype": "unique 3-word archetype label that fits this specific person",
  "deepRead": "paragraph 1 starting with **Bold insight TO them.** then 2 sentences using you/your.\\n\\nparagraph 2 starting with **Bold insight.** then 2 sentences using you/your.\\n\\nparagraph 3 starting with **Bold insight.** then 2 sentences using you/your.",
  "traits": [
    {"title": "unique trait name for this person", "score": 82, "headline": "short line starting with You", "detail": "1 sentence using you about this specific person"},
    {"title": "unique trait name", "score": 76, "headline": "short line starting with You", "detail": "1 sentence using you"},
    {"title": "unique trait name", "score": 79, "headline": "short line starting with You", "detail": "1 sentence using you"},
    {"title": "unique trait name", "score": 85, "headline": "short line starting with You", "detail": "1 sentence using you"}
  ],
  "superPowers": [
    {"emoji": "🔥", "title": "unique power name for this person", "description": "1 sentence starting with You"},
    {"emoji": "💡", "title": "unique power name", "description": "1 sentence starting with You"},
    {"emoji": "🎯", "title": "unique power name", "description": "1 sentence starting with You"},
    {"emoji": "🌊", "title": "unique power name", "description": "1 sentence starting with You"}
  ],
  "thingsToTry": [
    {"emoji": "🌱", "title": "action title", "description": "1 sentence using you", "tip": "one concrete action"},
    {"emoji": "📣", "title": "action title", "description": "1 sentence using you", "tip": "one concrete action"},
    {"emoji": "🤝", "title": "action title", "description": "1 sentence using you", "tip": "one concrete action"}
  ],
  "funTopics": [
    {"emoji": "🧠", "topic": "relevant topic for this person", "color": "bg-purple-100 text-purple-700"},
    {"emoji": "🌊", "topic": "relevant topic", "color": "bg-blue-100 text-blue-700"},
    {"emoji": "🔥", "topic": "relevant topic", "color": "bg-orange-100 text-orange-700"},
    {"emoji": "❤️", "topic": "relevant topic", "color": "bg-red-100 text-red-700"},
    {"emoji": "🎯", "topic": "relevant topic", "color": "bg-green-100 text-green-700"},
    {"emoji": "✨", "topic": "relevant topic", "color": "bg-yellow-100 text-yellow-700"}
  ]
}`;

  try {
    const raw = await callAI(prompt, 1200);
    const result = extractJSON<any>(raw, null);

    if (!result) return fallback;

    return {
      firstName,
      fullName,
      archetype: typeof result.archetype === "string" ? result.archetype : fallback.archetype,
      deepRead: typeof result.deepRead === "string" ? result.deepRead : fallback.deepRead,
      traits: Array.isArray(result.traits) && result.traits.length >= 4 ? result.traits : fallback.traits,
      superPowers: Array.isArray(result.superPowers) && result.superPowers.length >= 4 ? result.superPowers : fallback.superPowers,
      thingsToTry: Array.isArray(result.thingsToTry) && result.thingsToTry.length >= 3 ? result.thingsToTry : fallback.thingsToTry,
      funTopics: Array.isArray(result.funTopics) && result.funTopics.length >= 6 ? result.funTopics : fallback.funTopics,
    };
  } catch (err) {
    console.error("Profile analysis failed:", err);
    return fallback;
  }
}

// ── Journal Analysis ──────────────────────────────────────────────────────────
export async function analyzeJournalEntry(content: string): Promise<JournalAnalysis> {
  const prompt = `Read this journal entry and give a personal psychological analysis. Write directly TO the person using "you" and "your". Reference their actual words specifically. Never use third person.

Journal entry: "${content.slice(0, 600)}"

Return a JSON object with exactly these fields:
{
  "emotionalState": "2-4 words describing their exact emotional state right now",
  "emotionalScore": 7,
  "theme": "4-6 words for the core theme of this specific entry",
  "insights": [
    "first insight referencing their specific words",
    "second insight about a pattern in their entry",
    "third insight about something they may not have noticed"
  ],
  "recommendations": [
    "specific action for exactly what they shared",
    "second recommendation for their situation",
    "third recommendation"
  ],
  "affirmation": "one powerful sentence speaking directly to their heart based on what they wrote"
}`;

  const raw = await callAI(prompt, 700);
  const result = extractJSON<any>(raw, null);

  if (!result) throw new Error("Could not parse AI response for journal");

  if (
    typeof result.emotionalState !== "string" ||
    typeof result.emotionalScore !== "number" ||
    typeof result.theme !== "string" ||
    !Array.isArray(result.insights) ||
    !Array.isArray(result.recommendations) ||
    typeof result.affirmation !== "string"
  ) {
    throw new Error("Incomplete AI response structure");
  }

  return result as JournalAnalysis;
}