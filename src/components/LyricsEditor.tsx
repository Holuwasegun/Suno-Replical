"use client";

interface LyricsEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LyricsEditor({ value, onChange }: LyricsEditorProps) {
  const maxChars = 1500;
  const remaining = maxChars - value.length;

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxChars) {
            onChange(e.target.value);
          }
        }}
        placeholder="Write your lyrics here..."
        rows={6}
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-green-500 focus:outline-none"
      />
      <div
        className={`mt-1 text-right text-xs ${
          remaining < 100 ? "text-red-400" : "text-zinc-500"
        }`}
      >
        {remaining} / {maxChars}
      </div>
    </div>
  );
}
