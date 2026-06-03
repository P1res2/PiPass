import { SettingsLayout } from "@/components/layouts/SettingsLayout";
import { UnlockLayout } from "@/components/layouts/UnlockLayout";
import { VaultLayout } from "@/components/layouts/VaultLayout";
import { SettingsPage } from "./settings";
import { UnlockPage } from "./unlock";
import { VaultPage } from "./vault";

export const routes = [
  {
    path: "/",
    element: UnlockPage,
    layout: UnlockLayout,
  },
  {
    path: "/vault",
    element: VaultPage,
    layout: VaultLayout,
  },
  {
    path: "/settings",
    element: SettingsPage,
    layout: SettingsLayout,
  }
  // { path: "/vault/add", element: AddPage, layout: VaultLayout },
  // { path: "/settings", element: SettingsPage, layout: VaultLayout },
];
