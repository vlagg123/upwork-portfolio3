import Script from "next/script";

export default function Home() {
  return (
    <main className="wrap">
      <h1>EmbedChat</h1>

      <p className="lede">
        A lightweight AI chat widget that helps website visitors get instant
        answers from a business&apos;s own content.
      </p>

      <div className="card">
        <h2>What is EmbedChat?</h2>
        <p>
          EmbedChat is an AI-powered website assistant for small business
          websites, SaaS landing pages, agencies, online stores, and service
          providers. It helps visitors get quick answers based on the
          website&apos;s own content, such as services, pricing information,
          frequently asked questions, contact details, product descriptions,
          booking rules, support policies, and company information.
        </p>
      </div>

      <div className="card">
        <h2>What can it answer?</h2>
        <p>
          The assistant can answer questions about the business, available
          services, pricing, opening hours, booking steps, contact options,
          support rules, product details, and general information already
          present on the configured website.
        </p>
      </div>

      <div className="card">
        <h2>Grounded answers only</h2>
        <p>
          EmbedChat is designed to answer only from the configured site content.
          If the answer is not available on the page or in the provided content,
          the assistant should say that it does not have enough information
          instead of inventing details.
        </p>
      </div>

      <div className="card">
        <h2>Example use cases</h2>
        <p>
          A dental clinic can use EmbedChat to answer questions about opening
          hours, appointment booking, services, emergency contact, accepted
          payment methods, and general clinic information.
        </p>
        <p>
          A software agency can use EmbedChat to explain its services,
          development process, estimated timelines, technology stack, and how
          potential clients can request a quote.
        </p>
      </div>

      <div className="card">
        <h2>Why businesses use it</h2>
        <p>
          EmbedChat can reduce repetitive support messages, help visitors find
          answers faster, guide users toward the right product or service, and
          provide instant answers outside business hours.
        </p>
      </div>

      <div className="card">
        <h2>Customization</h2>
        <p>
          The widget can be customized with a chat title, accent color, welcome
          message, and approved content source. It is designed to be lightweight
          and easy to add to an existing website.
        </p>
      </div>

      <div className="card">
        <h2>Technology stack</h2>
        <p>
          EmbedChat is built with Next.js, JavaScript, and the OpenAI API. The
          frontend widget is lightweight, while the backend API handles the AI
          response. The project demonstrates practical AI integration, API
          handling, website embedding, and safe grounded-answer behavior.
        </p>
      </div>

      <div className="card">
        <h2>Try it live</h2>
        <p>
          The green chat bubble in the corner is this exact widget. Try asking
          questions like: “What is EmbedChat?”, “What can it answer?”, “Who is
          this useful for?”, “What technologies does it use?”, or “Give me an
          example use case.”
        </p>
      </div>

      <p className="hint">
        Portfolio demo project built with Next.js, vanilla JavaScript, and the
        OpenAI API.
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