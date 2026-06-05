import type { ReactNode } from "react";
import { motion } from "motion/react";
import { BaseLayout } from "./BaseLayout";
import { SettingsSideBar } from "./SettingsSideBar";
import { Header } from "@/components/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface SettingsLayoutProps {
  children: ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <BaseLayout>
      <SidebarProvider className="pt-6">
        <SettingsSideBar className="pt-6" variant="inset" />
        <SidebarInset>
          <Header />
          <ScrollArea>
            <motion.div
              className="flex flex-col h-full justify-end items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </BaseLayout>
  );
}
