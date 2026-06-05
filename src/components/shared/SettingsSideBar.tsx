import type { ComponentProps } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navSettings } from "@/routes";
import { getPathEnd } from "@/lib/navigation";
import { SearchForm } from "@/components/SearchForm";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";

export function SettingsSideBar({ ...props }: ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();

  function isActiveRoute(url: string): boolean {
    const pathStart = getPathEnd(url);
    const currentpathStart = getPathEnd(location.pathname);

    return pathStart === currentpathStart;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="flex flex-row items-center gap-0">
        <Button
          variant="outline"
          size="icon-lg"
          onClick={() => navigate("/vault")}
        >
          <span className="sr-only">Back</span>
          <ArrowLeft />
        </Button>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {navSettings.map((group, groupIdx) => (
          <SidebarGroup key={group.title || groupIdx}>
            {group.title && (
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const IconComponent = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActiveRoute(item.url)}
                      >
                        <Link
                          to={item.url}
                          className="flex flex-row items-center gap-0"
                        >
                          {IconComponent && <IconComponent />}
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
