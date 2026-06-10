# EmbedChat — AI chat widget for any website

A drop-in chat bubble that answers visitors' questions **from the site's own
content**. One `<script>` tag to install. No iframe, no SDK, no vendor
lock-in — the whole widget is ~6 KB of dependency-free vanilla JS.

**Live demo:** _add your Vercel URL here — the bubble on the landing page is
the widget itself._

## How it works

```
Any website                         Your Next.js deploy
───────────────────                 ─────────────────────────────
<script widget.js>  ──question──→   /api/widget-chat
                                      1. fetch + cache site text (10 min TTL)
                                      2. ground the model in that content
                    ←──answer────     3. OpenAI gpt-4o-mini, plain text
```

- **Grounded, not generic.** The model is instructed to answer only from the
  fetched site content, and to say "I don't have that information" otherwise.
- **Safe to expose.** `ALLOWED_SITES` locks the endpoint to your domains so
  strangers can't burn your API key from their own sites. CORS is handled.
- **Customizable per install** via data attributes: `data-site`,
  `data-title`, `data-accent`.

## Setup

```bash
npm install
cp .env.example .env.local   # add OPENAI_API_KEY, set ALLOWED_SITES
npm run dev                  # http://localhost:3000
```

Deploy to Vercel, set the two environment variables, then paste the script
tag (shown on the landing page) into any site you want the widget on.

## Project structure

```
public/widget.js              the embeddable widget (vanilla JS, no deps)
app/api/widget-chat/route.ts  grounded chat endpoint, site cache, CORS
app/page.tsx                  landing page that dogfoods the widget
```

## Honest limitations & roadmap

- Single-page grounding: it reads one URL. A site crawler + embeddings index
  (RAG) is the natural upgrade for large sites — see my project "Margin" for
  that architecture.
- In-memory cache resets on cold starts; swap for KV/Redis in production.
- Human handoff (email/Slack) is a small extension.

## License

MIT.
