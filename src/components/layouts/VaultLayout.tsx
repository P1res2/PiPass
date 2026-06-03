import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BaseLayout } from "./BaseLayout";
import { Button } from "@/components/ui/button";
import { Power, Settings } from "lucide-react";
import { useVaultStore } from "@/stores/vaultStore";

interface VaultLayoutProps {
  children: ReactNode;
}

export function VaultLayout({ children }: VaultLayoutProps) {
  const navigate = useNavigate();
  const { lock } = useVaultStore();

  const handleExit = async () => {
    lock();
    navigate("/", { replace: true });
  };

  return (
    <BaseLayout className="items-center justify-center">
      <Button
        className="fixed top-10 right-4"
        variant={"secondary"}
        onClick={handleExit}
      >
        <Power />
      </Button>
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
      <Button
        className="fixed bottom-4 left-4 "
        variant="secondary"
        size="icon"
        onClick={() => navigate("/settings")}
      >
        <span className="sr-only">Settings</span>
        <Settings />
      </Button>
    </BaseLayout>
  );
}
