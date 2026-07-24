// Tiny className combiner — avoids pulling in clsx just for this.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
