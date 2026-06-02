import type { ReactNode } from "react";
import { TitleBar } from "./TitleBar";
import { cn } from "@/lib/utils";

interface BaseLayoutProps {
  children: ReactNode;
  className?: string;
}

export function BaseLayout({ children, className }: BaseLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <TitleBar />
      <main className={cn("flex flex-1 overflow-hidden", className)}>
        {children}
      </main>
    </div>
  );
}
