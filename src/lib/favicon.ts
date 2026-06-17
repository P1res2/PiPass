import { invoke } from "@tauri-apps/api/core";
import { fetch } from "@tauri-apps/plugin-http";
import { writeFile, BaseDirectory, mkdir } from "@tauri-apps/plugin-fs";
import { appLocalDataDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";

// TLDs most common compounds — add more if needed
const MULTI_PART_TLDS = new Set([
  // Brasil e países lusófonos
  "com.br",
  "org.br",
  "net.br",
  "gov.br",
  "edu.br",
  // Reino Unido
  "co.uk",
  "org.uk",
  "me.uk",
  "net.uk",
  "gov.uk",
  "ac.uk",
  // Austrália
  "com.au",
  "org.au",
  "net.au",
  "gov.au",
  "edu.au",
  // Outros comuns
  "co.jp",
  "co.in",
  "co.nz",
  "co.za",
  "co.kr",
  "com.ar",
  "com.mx",
  "com.co",
  "com.pe",
  "com.ve",
  "com.sg",
  "com.hk",
  "com.tw",
]);

function extractRootDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split(".");

    if (parts.length >= 3) {
      const lastTwo = parts.slice(-2).join(".");
      if (MULTI_PART_TLDS.has(lastTwo)) {
        return parts.slice(-3).join(".");
      }
    }

    return parts.slice(-2).join(".");
  } catch {
    return url;
  }
}

export async function fetchAndSaveFavicon(
  target:
    | { type: "app"; path: string }
    | { type: "web"; url: string }
    | { type: "other"; name: string },
  credentialId: string,
) {
  if (target.type === "web") {
    const domain = extractRootDomain(target.url);
    const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    const response = await fetch(iconUrl);
    const buffer = await response.arrayBuffer();

    await mkdir("icons", {
      baseDir: BaseDirectory.AppLocalData,
      recursive: true,
    });

    await writeFile(`icons/${credentialId}.png`, new Uint8Array(buffer), {
      baseDir: BaseDirectory.AppLocalData,
    });

    return `icons/${credentialId}.png`;
  }

  if (target.type === "app") {
    return await invoke<string>("extract_exe_icon", {
      exePath: target.path,
      credentialId,
    });
  }

  return "";
}

export async function getFaviconSrc(iconPath: string) {
  const dir = await appLocalDataDir();
  const fullPath = await join(dir, iconPath);
  return convertFileSrc(fullPath);
}
