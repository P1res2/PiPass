import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { useSettingsStore } from "@/stores/settingsStore";
import type { Credential } from "@/lib/credential";
import {
  loadVault,
  saveCredential,
  getCredential,
  removeCredential,
  clearVault,
} from "@/lib/stronghold";
import { fetchAndSaveFavicon } from "@/lib/favicon";

interface VaultState {
  isUnlocked: boolean;
  credentials: Credential[];
  searchQuery: string;

  unlock: (password: string) => Promise<boolean>;
  lock: () => Promise<void>;
  addCredential: (
    cred: Omit<Credential, "id" | "createdAt" | "updatedAt">,
    password: string,
  ) => Promise<void>;
  updateCredential: (
    id: string,
    updates: Partial<Credential>,
    password?: string,
  ) => Promise<void>;
  deleteCredential: (id: string) => Promise<void>;
  loadCredentials: () => Promise<void>;
  setSearch: (query: string) => void;
}

let _lockTimer: ReturnType<typeof setTimeout> | null = null;
let _timerStartCount = 0;

function clearLockTimer() {
  if (_lockTimer) {
    clearTimeout(_lockTimer);
    _lockTimer = null;
  }
}

export function startLockTimer(lockFn: () => void) {
  clearLockTimer();

  const { settings } = useSettingsStore.getState();
  const minutes = settings?.autoLockMinutes;

  if (minutes === undefined || minutes === 0) {
    return;
  }

  const delayMs = minutes * 60 * 1000;
  _timerStartCount++;

  _lockTimer = setTimeout(() => {
    try {
      lockFn();
    } catch (err) {
      console.error("❌ Erro ao bloquear vault:", err);
    }
  }, delayMs);
}

// Export for debug
export function getLockTimerInfo() {
  return {
    isActive: _lockTimer !== null,
    startCount: _timerStartCount,
  };
}

export const useVaultStore = create<VaultState>((set, get) => ({
  isUnlocked: false,
  credentials: [],
  searchQuery: "",

  unlock: async (password) => {
    try {
      await loadVault(password);
      set({ isUnlocked: true });
      await get().loadCredentials();

      await invoke("set_vault_state", { unlocked: true });

      // Starts the self-lock timer with the store lock function
      const lockFn = async () => {
        await get().lock();
      };
      startLockTimer(lockFn);
      return true;
    } catch {
      return false;
    }
  },

  lock: async () => {
    clearLockTimer();
    clearVault();
    await invoke("set_vault_state", { unlocked: false });
    set({ isUnlocked: false, credentials: [] });
  },

  loadCredentials: async () => {
    const raw = await getCredential("index");
    if (!raw) return;

    const ids: string[] = JSON.parse(raw);

    const credentials = await Promise.all(
      ids.map(async (id) => {
        const raw = await getCredential(`meta:${id}`);
        return raw ? (JSON.parse(raw) as Credential) : null;
      }),
    );

    set({ credentials: credentials.filter(Boolean) as Credential[] });
  },

  addCredential: async (cred, password) => {
    const id = crypto.randomUUID();
    const iconPath = await fetchAndSaveFavicon(cred.target, id);
    console.log(iconPath);
    const newCred: Credential = {
      ...cred,
      id,
      iconPath: iconPath,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Save metadata and secret separately for better security
    await saveCredential(`meta:${id}`, JSON.stringify(newCred));

    await saveCredential(`secret:${id}`, password);

    // Update index
    const raw = await getCredential("index");
    const ids: string[] = raw ? JSON.parse(raw) : [];
    await saveCredential("index", JSON.stringify([...ids, id]));

    set((state) => ({ credentials: [...state.credentials, newCred] }));
  },

  updateCredential: async (id, updates, password) => {
    const existing = get().credentials.find((c) => c.id === id);
    if (!existing) return;

    const updated = { ...existing, ...updates, updatedAt: Date.now() };
    await saveCredential(`meta:${id}`, JSON.stringify(updated));

    if (password) {
      await saveCredential(`secret:${id}`, password);
    }

    set((state) => ({
      credentials: state.credentials.map((c) => (c.id === id ? updated : c)),
    }));
  },

  deleteCredential: async (id) => {
    await removeCredential(`meta:${id}`);
    await removeCredential(`secret:${id}`);

    // Remove from index
    const raw = await getCredential("index");
    const ids: string[] = raw ? JSON.parse(raw) : [];
    await saveCredential("index", JSON.stringify(ids.filter((i) => i !== id)));

    set((state) => ({
      credentials: state.credentials.filter((c) => c.id !== id),
    }));
  },

  setSearch: (query) => set({ searchQuery: query }),
}));
