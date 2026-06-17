import type { ComponentType } from "react";
import {
  SettingsLayout,
  VaultLayout,
  AddPasswordLayout,
} from "@/components/layouts";
import { VaultPage } from "./VaultPage";
import { AddPasswordPage } from "./AddPasswordPage";
import {
  GeneralSettingsPage,
  AppearancePage,
  KeyboardShortcutsPage,
  LanguagePage,
  LockAndVaultPage,
} from "./SettingsPages";
import {
  Keyboard,
  Languages,
  Palette,
  Settings,
  ShieldAlert,
} from "lucide-react";

// ── Tipagem ──────────────────────────────────────────

export interface NavItem {
  title: string;
  icon: ComponentType;
  url: string;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export interface Route {
  path: string;
  element: ComponentType;
  layout?: ComponentType<{ children: React.ReactNode }>;
}

// ── Nav de settings (pra montar o sidebar) ───────────

export const navSettings: NavGroup[] = [
  {
    items: [
      { title: "settings.general", icon: Settings, url: "/settings/general" },
    ],
  },
  {
    title: "settings.experience",
    items: [
      {
        title: "settings.appearance",
        icon: Palette,
        url: "/settings/appearance",
      },
      {
        title: "settings.keyboard-shortcuts",
        icon: Keyboard,
        url: "/settings/keyboard-shortcuts",
      },
      {
        title: "settings.language",
        icon: Languages,
        url: "/settings/language",
      },
    ],
  },
  {
    title: "settings.security",
    items: [
      {
        title: "settings.lock-and-vault",
        icon: ShieldAlert,
        url: "/settings/lock-and-vault",
      },
    ],
  },
];

// ── Mapa url → componente (separado do nav) ──────────

const settingsPages: Record<string, ComponentType> = {
  "/settings/general": GeneralSettingsPage,
  "/settings/appearance": AppearancePage,
  "/settings/keyboard-shortcuts": KeyboardShortcutsPage,
  "/settings/language": LanguagePage,
  "/settings/lock-and-vault": LockAndVaultPage,
};

const settingsRoutes: Route[] = navSettings
  .flatMap((group) => group.items)
  .map((item) => ({
    path: item.url,
    element: settingsPages[item.url],
    layout: SettingsLayout,
  }));

// ── Rotas principais ─────────────────────────────────

export const routes: Route[] = [
  { path: "/", element: VaultPage, layout: VaultLayout },
  {
    path: "/add-password",
    element: AddPasswordPage,
    layout: AddPasswordLayout,
  },
  ...settingsRoutes,
];
