import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { BaseLayout } from "./BaseLayout";

interface UnlockLayoutProps {
  children: ReactNode;
}

export function UnlockLayout({ children }: UnlockLayoutProps) {
  useEffect(() => {
    const currentWindow = getCurrentWindow();
    currentWindow.setSize(new LogicalSize(500, 400));
    currentWindow.center();
    currentWindow.setAlwaysOnTop(true);
  }, []);

  return (
    <BaseLayout className="items-center justify-center">
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
