"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X, Dumbbell } from "lucide-react";
import menuConfig from "@/config/menuConfig";
import { useAuthStore } from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";

const Sidebar = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  
  const {
    isMobileOpen,
    isCollapsed,
    closeMobileSidebar,
    toggleCollapsed,
  } = useSidebarStore();

  const [subMenus, setSubMenus] = useState<Record<string, boolean>>({});

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  const toggleSubMenu = (key: string) => {
    if (isCollapsed) toggleCollapsed();
    setSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const userRole = user?.role || 'customer';

  const filteredMenus = menuConfig
    .filter((menu) => menu.roles.includes(userRole))
    .map((menu) => ({
      ...menu,
      subMenu: menu.subMenu ? menu.subMenu.filter((sub) => sub.roles.includes(userRole)) : [],
    }));
    
  const isMenuActive = (menu: any) =>
    pathname === menu.path ||
    menu.subMenu?.some((sub: any) => sub.path === pathname);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/80 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          h-screen overflow-y-auto overflow-x-hidden scrollbar-hide
          flex flex-col shrink-0
          transition-all duration-300 ease-in-out
          bg-sidebar-bg dark:bg-sidebar-bg-dark
          text-sidebar-text dark:text-sidebar-text-dark
          shadow-xl lg:shadow-none
          ${isMobileOpen ? "translate-x-0 w-72 p-5 pt-6" : "-translate-x-full lg:translate-x-0"}
          ${!isMobileOpen && (isCollapsed ? "lg:w-20 lg:p-3 lg:pt-6" : "lg:w-64 lg:p-5 lg:pt-6")}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-3 mb-6">
          {/* Logo / Brand */}
          <Link
            href="/"
            onClick={closeMobileSidebar}
            className="flex items-center gap-3 overflow-hidden group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              DF
            </div>

            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col leading-tight">
                <span className="text-sidebar-text dark:text-sidebar-text-dark font-black text-lg tracking-wider uppercase">
                  DRAVON FIT
                </span>
                <span className="text-[11px] text-white/70 font-medium">
                  {userRole === "admin" ? "Admin Panel" : "Customer Area"}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleCollapsed}
            className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 text-sidebar-text dark:text-sidebar-text-dark transition focus:outline-none"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobileSidebar}
            className="flex lg:hidden p-2 rounded-lg hover:bg-white/10 text-sidebar-text dark:text-sidebar-text-dark transition focus:outline-none"
            title="Close Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items List */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          {filteredMenus.map((menu) => {
            const active = isMenuActive(menu);
            const hasSubMenu = menu.subMenu?.length > 0;
            const isOpen = !isCollapsed || isMobileOpen;

            return (
              <div key={menu.key} className="flex flex-col">
                <Link
                  href={hasSubMenu ? "#" : menu.path}
                  onClick={(e) => {
                    if (hasSubMenu) {
                      e.preventDefault();
                      toggleSubMenu(menu.key);
                    } else {
                      closeMobileSidebar();
                    }
                  }}
                  className={`
                    relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                    transition-all duration-200 cursor-pointer text-sm font-medium
                    text-sidebar-text dark:text-sidebar-text-dark
                    hover:bg-sidebar-hover dark:hover:bg-sidebar-hover-dark
                    ${active ? "bg-sidebar-active dark:bg-sidebar-active-dark font-semibold shadow-sm" : ""}
                    ${isOpen ? "justify-between" : "justify-center"}
                  `}
                  title={!isOpen ? menu.title : undefined}
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-white opacity-90" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    {menu.icon && (
                      <menu.icon className="w-5 h-5 shrink-0 text-sidebar-text dark:text-sidebar-text-dark" />
                    )}

                    {isOpen && (
                      <span className="truncate">{menu.title}</span>
                    )}
                  </div>

                  {hasSubMenu && isOpen && (
                    <span className="text-xs shrink-0 text-white/70">
                      {subMenus[menu.key] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </Link>

                {/* Submenu Items */}
                {hasSubMenu && subMenus[menu.key] && isOpen && (
                  <div className="pl-4 mt-1 flex flex-col gap-1">
                    {menu.subMenu.map((sub, i) => (
                      <Link
                        href={sub.path}
                        key={i}
                        onClick={closeMobileSidebar}
                        className={`
                          flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium
                          transition-all duration-200 cursor-pointer
                          text-sidebar-text/90 dark:text-sidebar-text-dark/90
                          hover:bg-sidebar-hover dark:hover:bg-sidebar-hover-dark
                          ${
                            pathname === sub.path
                              ? "bg-sidebar-active dark:bg-sidebar-active-dark font-semibold"
                              : ""
                          }
                        `}
                      >
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{sub.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="mt-auto pt-4 border-t border-white/10 dark:border-white/5 text-xs text-white/70 text-center">
            <p className="font-semibold text-white/90">DRAVON FIT v1.0</p>
            <p className="text-[10px] mt-0.5 opacity-80">All rights reserved</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
