import Script from "next/script";

export default function Home() {
  return (
    <main className="wrap">
      <h1>EmbedChat</h1>
      <p className="lede">
        A drop-in AI chat widget that answers visitors&apos; questions from
        your site&apos;s own content. One script tag. No iframe, no vendor
        lock-in.
      </p>

      <div className="card">
        <h2>Install on any website</h2>
        <p>Paste this before the closing body tag — that&apos;s the whole integration:</p>
      </div>

      <pre>{`<script
  src="https://YOUR-DEPLOY.vercel.app/widget.js"
  data-endpoint="https://YOUR-DEPLOY.vercel.app/api/widget-chat"
  data-site="https://your-website.com"
  data-title="Ask us anything"
  data-accent="#2e6b4e"
  defer></script>`}</pre>

      <div className="card">
        <h2>Grounded answers only</h2>
        <p>
          The assistant answers strictly from the configured site&apos;s
          content. If the information isn&apos;t there, it says so instead of
          inventing an answer.
        </p>
      </div>

      <div className="card">
        <h2>Try it live</h2>
        <p>
          The green bubble in the corner is this exact widget, configured to
          answer questions about this page.
        </p>
      </div>

      <p className="hint">
        Source on GitHub — MIT licensed. Built with Next.js, vanilla JS, and
        the OpenAI API.
      </p>

      <Script
        src="/widget.js"
        data-endpoint="/api/widget-chat"
        data-title="Ask about EmbedChat"
        data-accent="#2e6b4e"
        strategy="lazyOnload"
      />
    </main>
  );
}
