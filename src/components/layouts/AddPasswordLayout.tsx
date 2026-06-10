import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BaseLayout } from "./BaseLayout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";

interface AddPasswordProps {
  children: ReactNode;
}

export function AddPasswordLayout({ children }: AddPasswordProps) {
  const navigate = useNavigate();

  return (
    <BaseLayout className="pt-6 h-full">
      <Button
        className="fixed top-10 left-4 z-10"
        variant="secondary"
        size="icon"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft />
      </Button>
      <ScrollArea>
        <motion.div
          className="max-w-[60vw] mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </ScrollArea>
    </BaseLayout>
  );
}
