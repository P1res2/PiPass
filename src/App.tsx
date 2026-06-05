import { useEffect } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { routes } from "@/routes";
import { useSettingsStore } from "@/stores/settingsStore";

function AnimatedRoutes() {
  const location = useLocation();
  const { load } = useSettingsStore();

  useEffect(() => {
    load();
  }, [load]);

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
