import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice Journal",
  description: "Record your thoughts, get AI-powered structure",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={{ background: "#03040A" }}>
      <body style={{ background: "#03040A" }} className="antialiased">
        {children}
      </body>
    </html>
  );
}
