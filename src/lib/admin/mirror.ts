/** Mirror English text into required Malayalam DB columns while admin stays English-only. */
export function mirrorMl<T extends string | null | undefined>(english: T): T {
  return english;
}

export function mirrorPair(english: string) {
  return { en: english, ml: english };
}
