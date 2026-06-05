import { create } from "zustand";
import i18n from "@/lib/i18n";
import { getSettings, saveSettings, type Settings } from "@/lib/settings";

interface SettingsState {
  settings: Settings | null;
  load: () => Promise<Settings>;
  update: (updates: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,

  load: async () => {
    try {
      const settings = await getSettings();
      set({ settings });
      return settings;
    } catch (err) {
      console.error("Failed to load settings:", err);
      const defaults = await getSettings();
      set({ settings: defaults });
      return defaults;
    }
  },

  update: async (updates) => {
    try {
      if (updates.language) {
        await i18n.changeLanguage(updates.language);
      }
      await saveSettings(updates);
      set((state) => ({
        settings: state.settings ? { ...state.settings, ...updates } : null,
      }));
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  },
}));
