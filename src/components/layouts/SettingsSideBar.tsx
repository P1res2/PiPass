import type { ComponentProps } from "react";
import { Link, useLocation } from "react-router-dom";
import { navSettings } from "@/routes";
import { getPathLeaf } from "@/lib/navigation";
import { SearchForm } from "@/components/SearchForm";
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

export function SettingsSideBar({ ...props }: ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  function isActiveRoute(url: string): boolean {
    const pathStart = getPathLeaf(url);
    const currentpathStart = getPathLeaf(location.pathname);

    return pathStart === currentpathStart;
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
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
