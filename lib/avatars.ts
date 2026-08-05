// DiceBear's free, no-auth avatar API — clean, flat "notionists" style
// (professional illustrated people, no cartoonish exaggerated faces)
const DICEBEAR_BASE = "https://api.dicebear.com/9.x/notionists/svg";

// Background tints picked to match Cachet's Snow + Forest theme
// soft sage/cream tones instead of DiceBear's default bright pastels
const BRAND_BACKGROUNDS = [
  "eaf1ee", // accent soft (pale sage)
  "d7e5df", // light sage
  "c8ddd3", // deeper sage
  "fff7ed", // warm cream
  "f5f0e8", // parchment
  "e8ecea", // neutral mist
].join(",");

export function getAvatarUrl(seed: string): string {
  return `${DICEBEAR_BASE}?seed=${encodeURIComponent(seed)}&backgroundColor=${BRAND_BACKGROUNDS}`;
}

// random seed generate karta hai — naya avatar dikhane ke liye
export function generateRandomSeed(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function generateSeedBatch(count: number): string[] {
  return Array.from({ length: count }, () => generateRandomSeed());
}