import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Thunder Scout System Prompt
const THUNDER_SCOUT_PROMPT = `You are Thunder Scout for Dandle Recliners (Egypt's premium recliner brand).

PERSONALITY:
- Calm, premium, helpful tone
- Make people feel: "I enjoy using it. I'm proud to use it. This is my seat. The room feels right."
- Never use "sale/discount/limited time" language
- Never make medical or orthopedic claims
- Ask maximum 1 question per reply
- Keep replies 1-4 short lines
- If Arabic detected: use Egyptian Arabic, respectful and warm

MODELS WE OFFER:
RelaxMax, SpaceSaver, Diva, WorkNest, ComfortPlus, CozyCompanion, EasyUp, EasyUp Compact, Complete Sets

RESPONSE RULES:
- If user asks about prices/models: Ask which model interests them, offer to send full catalog
- If user asks about visiting/showroom: Offer to book appointment, ask preferred location/time
- If user mentions business/office/hotel/bulk: This is B2B - ask for quantity, timeline, city, then say specialist will follow up
- If user asks how to order: Include "WhatsApp: wa.link/dandle-recliners"
- Otherwise: Keep response short and helpful`;

// Detect language based on Arabic character presence
function detectLanguage(text: string): "AR" | "EN" {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(text) ? "AR" : "EN";
}

// Detect customer segment from message
function detectSegment(text: string): string {
  const lowerText = text.toLowerCase();
  const arabicText = text;

  // B2B indicators
  if (/business|office|hotel|bulk|corporate|شركة|فندق|مكتب|جملة|كمية/.test(lowerText + arabicText)) {
    return "b2b";
  }
  // Gift indicators
  if (/gift|present|هدية|لأبي|لأمي|لجدي|لجدتي|for my (dad|mom|father|mother|grandfather|grandmother)/.test(lowerText + arabicText)) {
    return "gift";
  }
  // Caregiver indicators
  if (/elderly|senior|parent|back pain|comfort|راحة|كبار السن|والدي|والدتي/.test(lowerText + arabicText)) {
    return "caregiver";
  }
  // Achiever indicators
  if (/premium|luxury|best|top|executive|فخم|راقي|أفضل/.test(lowerText + arabicText)) {
    return "achiever";
  }

  return "unknown";
}

// Generate AI response using simple rule-based + OpenAI fallback
async function generateAIResponse(
  message: string,
  language: "AR" | "EN",
  segment: string,
  openaiKey: string | undefined
): Promise<string> {
  const lowerMessage = message.toLowerCase();

  // Quick responses for common patterns
  if (/price|prices|cost|how much|سعر|أسعار|كام|بكام/.test(lowerMessage + message)) {
    return language === "AR"
      ? "أهلاً بيك! 🪑 عندنا موديلات مختلفة: RelaxMax, SpaceSaver, Diva, WorkNest, ComfortPlus, CozyCompanion, EasyUp. أي موديل يهمك أعرفك سعره؟"
      : "Welcome! 🪑 We have several models: RelaxMax, SpaceSaver, Diva, WorkNest, ComfortPlus, CozyCompanion, EasyUp. Which model interests you?";
  }

  if (/showroom|visit|see|معرض|أزور|أشوف|فين/.test(lowerMessage + message)) {
    return language === "AR"
      ? "يسعدنا زيارتك! 📍 تحب تحجز موعد؟ إيه المنطقة الأقرب ليك؟"
      : "We'd love to have you visit! 📍 Would you like to book an appointment? What area is most convenient for you?";
  }

  if (/order|buy|purchase|أطلب|أشتري|عايز/.test(lowerMessage + message)) {
    return language === "AR"
      ? "تقدر تطلب من خلال WhatsApp: wa.link/dandle-recliners أو قولي الموديل اللي يعجبك وأساعدك! 🪑"
      : "You can order via WhatsApp: wa.link/dandle-recliners or tell me which model you like and I'll help! 🪑";
  }

  if (segment === "b2b") {
    return language === "AR"
      ? "أهلاً بيك! للطلبات التجارية، ممكن تقولي الكمية المطلوبة والتوقيت والمدينة؟ هيتواصل معاك متخصص المبيعات. 🏢"
      : "Welcome! For business orders, could you share the quantity needed, timeline, and city? A sales specialist will follow up with you. 🏢";
  }

  // Try OpenAI if available
  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: THUNDER_SCOUT_PROMPT + `\n\nRespond in ${language === "AR" ? "Egyptian Arabic" : "English"}.` },
            { role: "user", content: message }
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0]?.message?.content || getDefaultResponse(language);
      }
    } catch (error) {
      console.error("OpenAI error:", error);
    }
  }

  return getDefaultResponse(language);
}

function getDefaultResponse(language: "AR" | "EN"): string {
  return language === "AR"
    ? "أهلاً بيك في Dandle! 🪑 إزاي أقدر أساعدك النهاردة؟"
    : "Welcome to Dandle! 🪑 How can I help you today?";
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
        "Authorization": `Basic ${auth}`,
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
      JSON.stringify({ status: "ok", service: "Thunder Scout WhatsApp Webhook" }),
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

    // Generate AI response
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
📱 From: ${from}
👤 Name: ${profileName || "Unknown"}
💬 MSG: ${body}
🤖 REPLY: ${aiReply}
🎯 SEGMENT: ${segment}`;

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
