// "/settings/appearance" → "settings"
export function getPathRoot(url: string): string {
  return url.split("/")[1] ?? ""
}

// "/settings/appearance" → "appearance"
export function getPathLeaf(url: string): string {
  return url.split("/").at(-1) ?? ""
}

// "/settings/appearance/colors" → ["settings", "appearance"]  (without the last)
export function getPathSegments(url: string): string[] {
  const parts = url.split("/").filter(Boolean)
  return parts.slice(0, -1)
}
