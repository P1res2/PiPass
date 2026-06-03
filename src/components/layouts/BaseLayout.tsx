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
      <main className={cn("flex flex-1 overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 p-4", className)}>
        {children}
      </main>
    </div>
  );
}
