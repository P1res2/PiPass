import { Client, Stronghold } from "@tauri-apps/plugin-stronghold";
import { appLocalDataDir } from "@tauri-apps/api/path";

let _stronghold: Stronghold | null = null;
let _client: Client | null = null;

// ── Initialization ─────────────────────────────

export async function loadVault(password: string) {
  const vaultPath = `${await appLocalDataDir()}/pipass.hold`;
  _stronghold = await Stronghold.load(vaultPath, password);

  try {
    _client = await _stronghold.loadClient("pipass");
  } catch {
    _client = await _stronghold.createClient("pipass");
    await _stronghold.save();
  }
}

export async function saveVault() {
  await getStronghold().stronghold.save();
}

export function clearVault() {
  _stronghold = null;
  _client = null;
}

function getStronghold() {
  if (!_stronghold || !_client) throw new Error("Vault not initialized");
  return { stronghold: _stronghold, client: _client };
}

// ── Credentials ────────────────────────────────

export async function saveCredential(key: string, value: string) {
  const { client, stronghold } = getStronghold();
  const store = client.getStore();
  const data = Array.from(new TextEncoder().encode(value));
  await store.insert(key, data);
  await stronghold.save();
}

export async function getCredential(key: string): Promise<string | null> {
  const { client } = getStronghold();
  const store = client.getStore();
  try {
    const data = await store.get(key);
    if (!data) return null;
    return new TextDecoder().decode(new Uint8Array(data));
  } catch {
    return null;
  }
}

export async function removeCredential(key: string) {
  const { client, stronghold } = getStronghold();
  const store = client.getStore();
  await store.remove(key);
  await stronghold.save();
}
