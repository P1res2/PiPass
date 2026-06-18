import { useEffect } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import {
  getCurrentWebviewWindow,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { listen } from "@tauri-apps/api/event";
import { useSettingsStore } from "@/stores/settingsStore";
import { startLockTimer, useVaultStore } from "@/stores/vaultStore";
import { loadVault } from "@/lib/stronghold";
import { applyTheme } from "@/lib/theme";
import i18n from "@/lib/i18n";
import { routes } from "@/routes";

function AnimatedRoutes() {
  const location = useLocation();
  const isUnlocked = useVaultStore((state) => state.isUnlocked);

  // When lock, hide the main and show the auth
  useEffect(() => {
    if (!isUnlocked) {
      const run = async () => {
        await getCurrentWebviewWindow().close();
        const auth = await WebviewWindow.getByLabel("auth");
        await auth?.show();
        await auth?.center();
        await auth?.setFocus();
      };
      run();
    }
  }, [isUnlocked]);

  // Activity tracker pra auto-lock
  useEffect(() => {
    if (!isUnlocked) return;

    const reset = () =>
      startLockTimer(async () => {
        await useVaultStore.getState().lock();
      });

    const timer = setTimeout(() => {
      window.addEventListener("mousemove", reset);
      window.addEventListener("keydown", reset);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [isUnlocked]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes.map((route) => {
          const Component = route.element;
          const Layout = route.layout;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                Layout ? (
                  <Layout>
                    <Component />
                  </Layout>
                ) : (
                  <Component />
                )
              }
            />
          );
        })}
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const init = async () => {
      await useVaultStore.getState().syncUnlock();
      const settings = await useSettingsStore.getState().load();
      if (settings?.language) i18n.changeLanguage(settings.language);
      if (settings?.theme) applyTheme(settings.theme);

      unlisten = await listen<string>("vault-unlocked", async (event) => {
        await loadVault(event.payload);
        await useVaultStore.getState().loadCredentials();
        useVaultStore.setState({ isUnlocked: true });

        const main = getCurrentWebviewWindow();
        await main.show();
        await main.setFocus();
      });
    };

    init();
    return () => unlisten?.();
  }, []);

  return (
    <MemoryRouter>
      <AnimatedRoutes />
    </MemoryRouter>
  );
}

export default App;
