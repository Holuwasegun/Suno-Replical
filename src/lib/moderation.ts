const ARTIST_BLOCKLIST = [
  "taylor swift", "the weeknd", "drake", "kanye west", "ed sheeran",
  "billie eilish", "olivia rodrigo", "bad bunny", "bts", "ariana grande",
  "justin bieber", "lady gaga", "bruno mars", "rihanna", "adele",
  "beyoncé", "beyonce", "elvis presley", "michael jackson", "prince",
  "madonna", "freddie mercury", "john lennon", "bob marley", "kurt cobain",
  "jimi hendrix", "whitney houston", "marvin gaye", "tupac", "biggie",
  "eminem", "jay-z", "kendrick lamar", "post malone", "harry styles",
  "dua lipa", "the beatles", "led zeppelin", "pink floyd", "nirvana",
  "queen", "radiohead", "coldplay", "metallica", "u2",
];

export function moderatePrompt(prompt: string): { flagged: boolean; reason?: string } {
  const lower = prompt.toLowerCase();

  for (const artist of ARTIST_BLOCKLIST) {
    if (lower.includes(artist)) {
      return {
        flagged: true,
        reason: `Prompt references a specific artist (${artist}). Please describe the style without naming specific artists.`,
      };
    }
  }

  return { flagged: false };
}
