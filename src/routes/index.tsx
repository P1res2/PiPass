// src/pages/routes.tsx
import {
  SettingsLayout,
  UnlockLayout,
  VaultLayout,
} from "@/components/layouts";
import { UnlockPage } from "./UnlockPage";
import { VaultPage } from "./VaultPage";
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
import type { ComponentType } from "react";

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
    items: [{ title: "Geral", icon: Settings, url: "/settings" }],
  },
  {
    title: "Experiência",
    items: [
      { title: "Aparência", icon: Palette, url: "/settings/appearance" },
      {
        title: "Atalhos do teclado",
        icon: Keyboard,
        url: "/settings/keyboard-shortcuts",
      },
      { title: "Idioma", icon: Languages, url: "/settings/language" },
    ],
  },
  {
    title: "Segurança",
    items: [
      {
        title: "Bloqueio e Cofre",
        icon: ShieldAlert,
        url: "/settings/lock-and-vault",
      },
    ],
  },
];

// ── Mapa url → componente (separado do nav) ──────────

const settingsPages: Record<string, ComponentType> = {
  "/settings": GeneralSettingsPage,
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
  { path: "/", element: UnlockPage, layout: UnlockLayout },
  { path: "/vault", element: VaultPage, layout: VaultLayout },
  ...settingsRoutes,
];
