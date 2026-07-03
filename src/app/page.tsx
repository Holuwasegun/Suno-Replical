import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-12 mt-16">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
          Create music with AI
        </h1>
        <p className="mx-auto max-w-xl text-lg text-zinc-400">
          Describe your song, choose your style, and get a unique track in seconds.
          No subscriptions, no credit cards.
        </p>
      </div>

      <div className="mb-12 flex gap-4">
        <Link
          href="/signup"
          className="rounded-md bg-green-600 px-6 py-3 text-base font-medium text-white transition hover:bg-green-500"
        >
          Get started free
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-zinc-700 px-6 py-3 text-base font-medium text-zinc-300 transition hover:bg-zinc-900"
        >
          Sign in
        </Link>
      </div>

      <div className="mb-16 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Describe", desc: "Write a prompt about genre, mood, and instrumentation." },
          { title: "Generate", desc: "AI creates your song in seconds, not minutes." },
          { title: "Download", desc: "Get your track as a high-quality audio file." },
        ].map((step) => (
          <div
            key={step.title}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6"
          >
            <h3 className="mb-2 font-medium text-white">{step.title}</h3>
            <p className="text-sm text-zinc-500">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="mb-4 text-left text-sm font-medium uppercase tracking-wider text-zinc-500">
          Example prompts
        </h2>
        <div className="space-y-3">
          {[
            "Lo-fi hip hop beat with vinyl crackle and a warm piano melody",
            "Upbeat synthwave track with arpeggiated bass and 80s drums",
            "Ambient soundscape with slow pads and gentle rainfall",
            "Acoustic folk song with fingerpicked guitar and soft harmonies",
          ].map((ex) => (
            <div
              key={ex}
              className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-left text-sm text-zinc-400"
            >
              &ldquo;{ex}&rdquo;
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
