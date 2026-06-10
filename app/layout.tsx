import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmbedChat — AI chat widget for any website",
  description:
    "A drop-in AI chat widget that answers visitors' questions from your site's own content. One script tag, no iframe, no vendor lock-in.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
