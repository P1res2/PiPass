import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BaseLayout } from "./BaseLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const navigate = useNavigate();

  return (
    <BaseLayout className="flex-col items-center justify-center relative">
      <Button
        className="absolute top-4 left-4"
        variant="secondary"
        size="icon"
        onClick={() => navigate(-1)}
      >
        <span className="sr-only">Back</span>
        <ArrowLeft />
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
    </BaseLayout>
  );
}
