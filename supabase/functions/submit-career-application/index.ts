import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RoleApplicationData {
  type: "role";
  role: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  proficiency: string;
  bestTool: string;
  yearsExperience: string;
  linkedin?: string;
  answer1: string;
  answer2: string;
  answer3: string;
  cvUrl: string;
}

interface GeneralApplicationData {
  type: "general";
  fullName: string;
  phone: string;
  email: string;
  city: string;
  roleInterest: string;
  note: string;
  cvUrl: string;
}

type ApplicationData = RoleApplicationData | GeneralApplicationData;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ApplicationData = await req.json();
    const timestamp = new Date().toISOString();

    let emailHtml = "";
    let subject = "";

    if (data.type === "role") {
      subject = `New Application: ${data.role} — ${data.fullName}`;
      emailHtml = `
        <h2>New Application: ${data.role}</h2>
        <p><strong>Received:</strong> ${timestamp}</p>

        <h3>Applicant Details</h3>
        <ul>
          <li><strong>Name:</strong> ${data.fullName}</li>
          <li><strong>Phone:</strong> ${data.phone}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>City:</strong> ${data.city}</li>
          <li><strong>Proficiency:</strong> ${data.proficiency}</li>
          <li><strong>Best Tool:</strong> ${data.bestTool}</li>
          <li><strong>Experience:</strong> ${data.yearsExperience} years</li>
          <li><strong>LinkedIn:</strong> ${data.linkedin || "Not provided"}</li>
        </ul>

        <h3>Answers</h3>
        <p><strong>1. Proudest 'mess → system' story:</strong><br>${data.answer1.replace(/\n/g, "<br>")}</p>
        <p><strong>2. What to master next:</strong><br>${data.answer2.replace(/\n/g, "<br>")}</p>
        <p><strong>3. Why Dandle:</strong><br>${data.answer3.replace(/\n/g, "<br>")}</p>

        <p><strong>CV:</strong> <a href="${data.cvUrl}">Download CV</a></p>
      `;
    } else {
      subject = `General Application — ${data.fullName} (${data.roleInterest})`;
      emailHtml = `
        <h2>General Application</h2>
        <p><strong>Received:</strong> ${timestamp}</p>

        <h3>Applicant Details</h3>
        <ul>
          <li><strong>Name:</strong> ${data.fullName}</li>
          <li><strong>Phone:</strong> ${data.phone}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>City:</strong> ${data.city}</li>
          <li><strong>Role Interest:</strong> ${data.roleInterest}</li>
        </ul>

        <h3>Note</h3>
        <p>${data.note.replace(/\n/g, "<br>")}</p>

        <p><strong>CV:</strong> <a href="${data.cvUrl}">Download CV</a></p>
      `;
    }

    // Send email notification via Resend REST API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Dandle Careers <onboarding@resend.dev>",
        to: ["Tell.me@DandleStoreGroup.com"],
        subject,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error("Failed to send email notification");
    }

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in submit-career-application:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
