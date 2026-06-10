export const runtime = "nodejs";

type HistoryMessage = { role: "user" | "assistant"; content: string };

const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_CONTEXT_CHARS = 14000;

// Per-instance in-memory cache of extracted site text.
const cache = new Map<string, { text: string; at: number }>();

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

function json(body: object, status = 200) {
  return Response.json(body, { status, headers: CORS });
}

function siteAllowed(site: string): boolean {
  const allowed = (process.env.ALLOWED_SITES || "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
  if (allowed.length === 0) return true; // demo mode; lock down in production
  try {
    const origin = new URL(site).origin;
    return allowed.some((a) => origin === new URL(a).origin);
  } catch {
    return false;
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function getSiteText(site: string): Promise<string> {
  const key = new URL(site).origin;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.text;

  const r = await fetch(site, {
    headers: { "User-Agent": "EmbedChatBot/1.0 (+content-grounded site assistant)" },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`Could not fetch the site (${r.status}).`);

  const text = htmlToText(await r.text()).slice(0, MAX_CONTEXT_CHARS);
  if (text.length < 100) {
    throw new Error("The site returned too little readable text to answer from.");
  }
  cache.set(key, { text, at: Date.now() });
  return text;
}

export async function POST(req: Request) {
  try {
    const { question, site, history } = await req.json();

    if (typeof question !== "string" || question.trim().length === 0) {
      return json({ error: "Question is required." }, 400);
    }
    if (typeof site !== "string" || !/^https?:\/\//.test(site)) {
      return json({ error: "A valid site URL is required." }, 400);
    }
    if (!siteAllowed(site)) {
      return json({ error: "This site is not on the allowed list." }, 403);
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) return json({ error: "OPENAI_API_KEY is not set on the server." }, 500);

    const siteText = await getSiteText(site);

    const past = Array.isArray(history)
      ? (history as HistoryMessage[]).slice(-6)
      : [];

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant for a website. Answer ONLY from the site content provided. " +
              "If the answer is not in the content, say you don't have that information and suggest contacting the site owner. " +
              "Be brief, friendly, and concrete. Plain text only.",
          },
          ...past,
          {
            role: "user",
            content: `Site content:\n\n${siteText}\n\nVisitor question: ${question}`,
          },
        ],
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return json({ error: `Model request failed (${r.status}): ${detail.slice(0, 200)}` }, 502);
    }

    const data = await r.json();
    return json({ answer: data.choices?.[0]?.message?.content ?? "" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return json({ error: message }, 500);
  }
}
