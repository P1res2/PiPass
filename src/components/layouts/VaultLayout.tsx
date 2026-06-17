import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useVaultStore } from "@/stores/vaultStore";
import { BaseLayout } from "./BaseLayout";
import { Button } from "@/components/ui/button";
import { Lock, Settings } from "lucide-react";

interface VaultLayoutProps {
  children: ReactNode;
}

export function VaultLayout({ children }: VaultLayoutProps) {
  const navigate = useNavigate();
  const { lock } = useVaultStore();

  const handleExit = async () => {
    await lock();
    navigate("/", { replace: true });
  };

  return (
    <BaseLayout className="pt-6 h-full">
      <motion.div
        className="max-w-[60vw] mx-auto my-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      <Button
        className="fixed bottom-12 left-4"
        variant={"secondary"}
        size="icon"
        onClick={handleExit}
      >
        <Lock />
      </Button>
      <Button
        className="fixed bottom-4 left-4 "
        variant="secondary"
        size="icon"
        onClick={() => navigate("/settings/general", { replace: true })}
      >
        <span className="sr-only">Settings</span>
        <Settings />
      </Button>
    </BaseLayout>
  );
}
