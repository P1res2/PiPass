import type { ComponentProps } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { getPathLeaf } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, X } from "lucide-react";

interface HeaderProps extends ComponentProps<"div"> {
  hasBackArrow?: boolean;
}

export function Header({
  hasBackArrow = false,
  className,
  ...props
}: HeaderProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentPage = getPathLeaf(pathname);

  return (
    <header
      {...props}
      className={cn(
        "flex h-10 shrink-0 justify-left items-center border-b pl-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {hasBackArrow && (
          <>
            <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <Separator orientation="vertical" className="h-4 my-auto" />
          </>
        )}

        <Breadcrumb>
          <BreadcrumbList>
            {/* Current page segment */}
            <motion.div
              className="w-full max-w-sm h-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <BreadcrumbItem>
                <BreadcrumbPage className="h-4">
                  {currentPage.toUpperCase().at(0) +
                    currentPage.replaceAll("-", " ").slice(1)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </motion.div>
          </BreadcrumbList>
        </Breadcrumb>

        <Button
          className="fixed right-4"
          variant="ghost"
          size="icon"
          onClick={() => navigate("/vault", { replace: true })}
        >
          <span className="sr-only">Back</span>
          <X />
        </Button>
      </div>
    </header>
  );
}
