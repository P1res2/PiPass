import { useEffect, useState } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useSettingsStore } from "@/stores/settingsStore";
import i18n from "@/lib/i18n";
import { routes } from "@/routes";

function AnimatedRoutes() {
  const location = useLocation();
  const [isReady, setIsReady] = useState(i18n.isInitialized);

  useEffect(() => {
    useSettingsStore
      .getState()
      .load()
      .then((settings) => {
        if (settings?.language) {
          i18n.changeLanguage(settings.language);
        }
        setIsReady(true);
      });
  }, []);

  if (!isReady) {
    return null;
  }

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
    const init = async () => {
      const main = getCurrentWebviewWindow();
      await main.show();
    };
    init();
  }, []);

  return (
    <MemoryRouter>
      <AnimatedRoutes />
    </MemoryRouter>
  );
}

export default App;
