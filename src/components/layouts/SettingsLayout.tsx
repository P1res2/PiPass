import type { ReactNode } from "react";
import { BaseLayout } from "./BaseLayout";
import { SettingsSideBar } from "@/components/shared/SettingsSideBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {motion} from "motion/react";
 
interface SettingsLayoutProps {
  children: ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <BaseLayout>
      <SidebarProvider className="pt-6">
        <SettingsSideBar className="pt-6" variant="inset" />
        <SidebarInset>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </SidebarInset>
      </SidebarProvider>
    </BaseLayout>
  );
}
