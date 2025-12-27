import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Thunder Scout v14.5 System Prompt (Bible-compliant)
export const THUNDER_SCOUT_SYSTEM_PROMPT = `
You are THUNDER SCOUT — Dandle's senior furniture consultant on WhatsApp, based in Cairo.
You do not "assist." You consult. You solve. You speak with quiet confidence.

Goal (make them feel):
"I enjoy using it. I'm proud to use it. This is my seat. The room feels right."

Voice:
- 1 thought per message. 1–4 short lines total. Then stop.
- Max ONE question per reply.
- Price is stated cleanly (no apology, no persuasion).
- Emojis: max 0–2 total, only 🤍 or ✨.

Hard bans:
- Never use: sale, discount, limited time, offer, cheap, hurry.
- No medical claims: don't say doctor/orthopedic/therapy/treat/cure.
- Never mention "Swiss knife" or "knife".

Language:
- English in → English out.
- Arabic in → Egyptian Arabic out (warm, respectful, not formal).
- Mixed input → mixed output naturally (keep the user's English product words).

Discovery (never a checklist):
Start with where the chair will live OR the feeling they want.
Ask only ONE gentle question that moves the story forward.

Segments (detect silently, respond accordingly):
- Price-only: answer price + 1 question (manual vs power / room size).
- Gift: shift to reverence; ask about recipient.
- Senior/mobility ("hard to get up"): dignity language, recommend EasyUp/EasyUp Compact.
- Home office: WorkNest = flow state (quiet body, active mind).
- Aesthetic/design: Diva = presence + touch; lead visually.
- B2B/bulk: ask company + quantity + city; say business lead will follow up.

Recommendations (sacred order):
1) Model name (confident)
2) Why it fits THEIR life (2 lines max)
3) Price (clear)
4) ONE question

When uncertain: ask ONE clarifying question, then stop.
Always protect brand: value is engineering + home feeling, not noise.

Close line you may use sparingly:
"Comfort crafted for the finest."
`;

// Dandle Catalog (prices in EGP, no medical claims)
export const DANDLE_CATALOG = [
  { key: "RelaxMax", truth: "Easy everyday comfort", manual: 21900, power: 28900, massage: "not available" },
  { key: "SpaceSaver", truth: "Smart space comfort", manual: 24900, power: 29900, massage: "+9000" },
  { key: "Diva", truth: "Expressive high-touch comfort", manual: 23900, power: 30900, massage: "+9000" },
  { key: "WorkNest", truth: "Flow-first performance", manual: 26900, power: 33900, massage: "+9000", note: "online exclusive" },
  { key: "ComfortPlus", truth: "Indulgent deep relaxation", power: 36900, massage: "built-in" },
  { key: "CozyCompanion", truth: "Gravitational home anchor", manual: 42000, power: 54000, massage: "+18000 both seats" },
  { key: "EasyUp", truth: "Dignified effortless rise", lift: 28900, massage: "+9000" },
  { key: "EasyUp Compact", truth: "Dignity in small spaces", lift: 37900, massage: "not available" },
  { key: "Complete Sets", truth: "Whole-room comfort system", manualSet: 62900, powerSet: 90900 },
];

// Banned words (Bible-compliant)
const BANNED = [
  "sale", "discount", "limited time", "offer", "buy now", "cheap", "hurry",
  "doctor", "orthopedic", "therapy", "treat", "cure", "swiss knife", "knife"
];

// Thunder Output Guard - enforces Bible rules at runtime
function enforceThunderOutput(text: string): string {
  let t = text;

  // Remove banned words (case-insensitive)
  for (const w of BANNED) {
    const re = new RegExp(`\\b${w.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "ig");
    t = t.replace(re, "");
  }

  // Normalize whitespace + split lines
  let lines = t
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Max 4 lines
  lines = lines.slice(0, 4);

  // Count question marks
  let qCount = 0;
  for (const line of lines) {
    for (const ch of line) {
      if (ch === "?") qCount++;
    }
  }

  // If more than one question mark, remove extras
  if (qCount > 1) {
    let seen = 0;
    lines = lines.map((line) => {
      if (!line.includes("?")) return line;
      const parts = line.split("?");
      let rebuilt = "";
      for (let i = 0; i < parts.length; i++) {
        if (i === parts.length - 1) {
          rebuilt += parts[i];
        } else {
          if (seen === 0) {
            rebuilt += parts[i] + "?";
            seen++;
          } else {
            rebuilt += parts[i];
          }
        }
      }
      return rebuilt.trim();
    });
  }

  // Final cleanup
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

// Detect language based on Arabic character presence
function detectLanguage(text: string): "AR" | "EN" {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(text) ? "AR" : "EN";
}

// Detect customer segment from message (silent detection for routing)
function detectSegment(text: string): string {
  const lowerText = text.toLowerCase();
  const arabicText = text;

  // B2B indicators
  if (/business|office|hotel|bulk|corporate|company|wholesale|شركة|فندق|مكتب|جملة|كمية/.test(lowerText + arabicText)) {
    return "b2b";
  }
  // Gift indicators
  if (/gift|present|هدية|لأبي|لأمي|لجدي|لجدتي|for my (dad|mom|father|mother|grandfather|grandmother|parent)/.test(lowerText + arabicText)) {
    return "gift";
  }
  // Senior/mobility indicators
  if (/elderly|senior|hard to get up|mobility|stand up|صعب يقوم|كبار السن|والدي|والدتي|جدي|جدتي/.test(lowerText + arabicText)) {
    return "senior-mobility";
  }
  // Price-only indicators
  if (/price|prices|cost|how much|كام|بكام|سعر|أسعار/.test(lowerText + arabicText)) {
    return "price-only";
  }
  // Aesthetic/design indicators
  if (/design|style|look|beautiful|elegant|color|fabric|شكل|لون|قماش|أنيق|جميل/.test(lowerText + arabicText)) {
    return "aesthetic";
  }
  // Home office indicators
  if (/work|office|desk|home office|شغل|مكتب/.test(lowerText + arabicText)) {
    return "home-office";
  }
  // Researcher (general inquiry)
  if (/what is|tell me|information|models|types|إيه|عايز أعرف|معلومات/.test(lowerText + arabicText)) {
    return "researcher";
  }

  return "unknown";
}

// Generate AI response using OpenAI with Thunder Scout prompt
async function generateAIResponse(
  message: string,
  language: "AR" | "EN",
  segment: string,
  openaiKey: string | undefined
): Promise<string> {
  // Try OpenAI if available
  if (openaiKey) {
    try {
      const languageInstruction = language === "AR"
        ? "Respond in Egyptian Arabic (warm, respectful, not formal)."
        : "Respond in English.";

      const messages = [
        { role: "system", content: THUNDER_SCOUT_SYSTEM_PROMPT },
        { role: "system", content: `Catalog (prices EGP): ${JSON.stringify(DANDLE_CATALOG)}` },
        { role: "system", content: languageInstruction },
        { role: "user", content: message },
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawReply = data.choices[0]?.message?.content || "";
        // Apply Thunder Output Guard
        return enforceThunderOutput(rawReply) || getDefaultResponse(language, segment);
      }
    } catch (error) {
      console.error("OpenAI error:", error);
    }
  }

  // Fallback: rule-based responses (Thunder-compliant)
  return getFallbackResponse(message, language, segment);
}

// Fallback responses when OpenAI is unavailable
function getFallbackResponse(message: string, language: "AR" | "EN", segment: string): string {
  const lowerMessage = message.toLowerCase();

  // Price-only segment
  if (segment === "price-only" || /price|كام|بكام|سعر/.test(lowerMessage + message)) {
    return language === "AR"
      ? "أسعارنا تبدأ من ٢١,٩٠٠ ج.م للمانيوال. ✨\nبتفضل مانيوال ولا باور؟"
      : "Prices start at 21,900 EGP for manual. ✨\nDo you prefer manual or power?";
  }

  // B2B segment
  if (segment === "b2b") {
    return language === "AR"
      ? "للطلبات التجارية، ممكن تقولي اسم الشركة والكمية والمدينة؟\nهيتواصل معاك متخصص المبيعات. 🤍"
      : "For business orders, could you share the company name, quantity, and city?\nA business specialist will follow up. 🤍";
  }

  // Gift segment
  if (segment === "gift") {
    return language === "AR"
      ? "هدية جميلة. 🤍\nللوالد ولا الوالدة؟"
      : "A beautiful gift. 🤍\nIs it for him or her?";
  }

  // Senior/mobility segment
  if (segment === "senior-mobility") {
    return language === "AR"
      ? "EasyUp صُمم للقيام بكل سهولة وكرامة.\nيبدأ من ٢٨,٩٠٠ ج.م. ✨\nحابب أحكيلك أكتر؟"
      : "EasyUp is designed for effortless, dignified rising.\nStarts at 28,900 EGP. ✨\nWould you like to know more?";
  }

  // Home office segment
  if (segment === "home-office") {
    return language === "AR"
      ? "WorkNest للي بيشتغل من البيت.\nجسم هادي، ذهن نشيط. ✨\nالمكتب في أوضة لوحده ولا في الصالون؟"
      : "WorkNest is for home office flow.\nQuiet body, active mind. ✨\nIs your workspace in a dedicated room or shared space?";
  }

  // Showroom/visit
  if (/showroom|visit|معرض|أزور|فين/.test(lowerMessage + message)) {
    return language === "AR"
      ? "سيتي ستارز، الدور التاني. 🤍\nتحب تحجز موعد؟"
      : "Citystars, second floor. 🤍\nWould you like to book an appointment?";
  }

  // Order inquiry
  if (/order|buy|أطلب|أشتري|عايز/.test(lowerMessage + message)) {
    return language === "AR"
      ? "تقدر تطلب من هنا مباشرة. ✨\nإيه الموديل اللي عجبك؟"
      : "You can order right here. ✨\nWhich model caught your eye?";
  }

  // Default greeting
  return getDefaultResponse(language, segment);
}

function getDefaultResponse(language: "AR" | "EN", _segment: string): string {
  return language === "AR"
    ? "أهلاً بيك في Dandle. 🤍\nالكرسي هيكون فين في البيت؟"
    : "Welcome to Dandle. 🤍\nWhere will the chair live in your home?";
}

// Send WhatsApp message via Twilio
async function sendWhatsAppMessage(
  to: string,
  body: string,
  twilioSid: string,
  twilioToken: string,
  twilioNumber: string
): Promise<boolean> {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
    const auth = btoa(`${twilioSid}:${twilioToken}`);

    const formData = new URLSearchParams();
    formData.append("From", twilioNumber);
    formData.append("To", to);
    formData.append("Body", body);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twilio send error:", response.status, errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Twilio send exception:", error);
    return false;
  }
}

// Log message to database
async function logMessage(
  supabase: any,
  phoneNumber: string,
  messageType: "inbound" | "outbound" | "owner_cc",
  messageText: string,
  language: string | null,
  segment: string | null,
  profileName: string | null
): Promise<void> {
  try {
    const { error } = await supabase.from("whatsapp_conversations").insert({
      phone_number: phoneNumber,
      message_type: messageType,
      message_text: messageText,
      language,
      segment_detected: segment,
      profile_name: profileName,
    });

    if (error) {
      console.error("DB log error:", error);
    }
  } catch (error) {
    console.error("DB log exception:", error);
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check for GET
  if (req.method === "GET") {
    return new Response(
      JSON.stringify({ status: "ok", service: "Thunder Scout v14.5 WhatsApp Webhook" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Parse Twilio webhook (x-www-form-urlencoded)
    const formData = await req.formData();
    const from = formData.get("From")?.toString() || "";
    const body = formData.get("Body")?.toString() || "";
    const profileName = formData.get("ProfileName")?.toString() || null;

    if (!from || !body) {
      console.log("Missing From or Body in webhook");
      return new Response(
        JSON.stringify({ ok: true, note: "Missing required fields" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Incoming WhatsApp from ${from}: ${body}`);

    // Get environment variables
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID") || "";
    const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN") || "";
    const twilioNumber = Deno.env.get("TWILIO_WHATSAPP_NUMBER") || "";
    const ownerNumber = Deno.env.get("OWNER_WHATSAPP_NUMBER") || "whatsapp:+201222804255";
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Detect language and segment
    const language = detectLanguage(body);
    const segment = detectSegment(body);

    // Log inbound message
    await logMessage(supabase, from, "inbound", body, language, segment, profileName);

    // Generate AI response (Thunder Scout v14.5)
    const aiReply = await generateAIResponse(body, language, segment, openaiKey);

    // Send reply to customer
    if (twilioSid && twilioToken && twilioNumber) {
      const sent = await sendWhatsAppMessage(from, aiReply, twilioSid, twilioToken, twilioNumber);
      if (sent) {
        // Log outbound message
        await logMessage(supabase, from, "outbound", aiReply, language, segment, null);
      }

      // Send CC to owner
      const ownerMessage = `🔔 NEW LEAD
📱 ${from}
👤 ${profileName || "—"}
🎯 ${segment}

💬 "${body}"

🤖 "${aiReply}"`;

      const ownerSent = await sendWhatsAppMessage(ownerNumber, ownerMessage, twilioSid, twilioToken, twilioNumber);
      if (ownerSent) {
        await logMessage(supabase, ownerNumber, "owner_cc", ownerMessage, null, segment, null);
      }
    } else {
      console.warn("Twilio credentials missing - messages not sent");
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    // Always return 200 to prevent Twilio retries
    return new Response(
      JSON.stringify({ ok: true, error: "Internal error logged" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
