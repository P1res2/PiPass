export function getPathStart(url: string): string {
  return url.split("/")[1];
}

export function getPathEnd(url: string): string {
  return url.split("/").at(-1) || "";
}
