import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { BaseLayout } from "./BaseLayout";

interface VaultLayoutProps {
  children: ReactNode;
}

export function VaultLayout({ children }: VaultLayoutProps) {
  useEffect(() => {
    const currentWindow = getCurrentWindow();
    currentWindow.setSize(new LogicalSize(1280, 720));
    currentWindow.center();
    currentWindow.setAlwaysOnTop(false);
  }, []);

  return (
    <BaseLayout className="items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </BaseLayout>
  );
}
