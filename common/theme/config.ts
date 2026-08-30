// Centralized theme configuration for the Programming Fundamentals lessons.
// Change it here and it applies to every deck.

export const THEME_CONFIG = {
  // neversink colour scheme, applied to #page-root on mount.
  // Options: white, black, dark, light, navy, slate, gray, zinc, neutral, stone,
  //          red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky,
  //          blue, indigo, violet, purple, fuchsia, pink, rose
  // Suffix with -light-scheme or -scheme.
  scheme: 'neversink-blue-light-scheme' as string,

  // Slug of the lesson currently being taught. Earlier lessons are marked complete on
  // the hub grid; this one is marked as active. Set to '' to mark none.
  currentLesson: '01-intro' as string,

  // Extra CSS variables set on :root, e.g. { '--custom-accent': '#78716c' }.
  customVars: {} as Record<string, string>,
}

export type ThemeScheme = typeof THEME_CONFIG.scheme
