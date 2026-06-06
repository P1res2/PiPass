import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TitleBar } from "./TitleBar";

interface BaseLayoutProps {
  children: ReactNode;
  className?: string;
}

export function BaseLayout({ children, className }: BaseLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <TitleBar />
      <main className={cn("overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900", className)}>
        {children}
      </main>
    </div>
  );
}
