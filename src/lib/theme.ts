export type Theme = (typeof themes)[number]["code"];

export const themes = [
  {
    code: "dark",
    label: "appearance-page.dark",
  },
  {
    code: "light",
    label: "appearance-page.light",
  },
  {
    code: "system",
    label: "appearance-page.system",
  },
] as const;

export function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

export function watchSystemTheme(callback: (theme: "dark" | "light") => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };

  media.addEventListener("change", handler);
  return () => media.removeEventListener("change", handler); // cleanup
}
