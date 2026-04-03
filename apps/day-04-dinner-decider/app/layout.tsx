import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dinner Decider",
  description: "AI-powered household dinner suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={{ background: "#F2F8F4" }}>
      <body style={{ background: "#F2F8F4" }} className="antialiased">
        {children}
      </body>
    </html>
  );
}
