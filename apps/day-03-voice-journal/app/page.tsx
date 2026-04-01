import VoiceJournal from "@/components/VoiceJournal";
import { Stars } from "@/components/Stars";

export default function Home() {
  return (
    <main className="relative">
      {/* Nebula glows */}
      <div
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 0% 0%, rgba(24,95,165,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 100% 100%, rgba(55,138,221,0.09) 0%, transparent 70%),
            radial-gradient(ellipse 40% 45% at 100% 0%, rgba(14,55,110,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 45% 40% at 0% 100%, rgba(30,80,160,0.08) 0%, transparent 60%)
          `,
        }}
      />
      <Stars />
      <VoiceJournal isDemo={process.env.NODE_ENV !== "development"} />
    </main>
  );
}
