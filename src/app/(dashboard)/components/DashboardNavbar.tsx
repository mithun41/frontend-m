"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, ChevronRight, LogOut, User, MoreVertical, Key, Menu } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useRouter } from "next/navigation";
import ProfileModal from "./ProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { getImageUrl } from "@/utils/getImageUrl";
import Link from "next/link";

// Mocking theme hook since global theme is controlled via dark class
const useTheme = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  return { isDark, toggleTheme };
};

const DashboardNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const authUser = useAuthStore((state) => state.user);
  const logoutAction = useAuthStore((state) => state.logout);
  const toggleMobileSidebar = useSidebarStore((state) => state.toggleMobileSidebar);
  const router = useRouter();
  
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const logout = () => {
    logoutAction();
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="
        w-full h-16
        bg-navbar-bg dark:bg-navbar-bg-dark
        text-navbar-text dark:text-navbar-text-dark
        border-b border-navbar-border dark:border-navbar-border-dark
        shadow-xs
        flex items-center justify-between px-3 sm:px-6 gap-3
        sticky top-0 z-30 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95
      "
    >
      {/* Left side: Hamburger Button (mobile/tablet) + Logo/Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="
            lg:hidden p-2 rounded-xl
            text-gray-600 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-primary-500/20
            transition-colors
          "
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-black text-sm">
            DF
          </div>
          <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white tracking-tight">
            DRAVON FIT
          </span>
        </Link>
      </div>

      {/* Right side: Theme toggle + Profile Pill */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className="
            p-2 rounded-xl
            hover:bg-navbar-hover dark:hover:bg-navbar-hover-dark
            text-gray-600 dark:text-gray-300
            transition-colors focus:outline-none
          "
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="text-yellow-400 h-5 w-5" />
          ) : (
            <Moon className="text-navbar-text dark:text-navbar-text-dark h-5 w-5" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div ref={menuRef} className="relative">
          <div
            onClick={() => setMenuOpen((prev) => !prev)}
            className="
              flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl
              border border-navbar-border dark:border-navbar-border-dark
              bg-navbar-bg dark:bg-navbar-bg-dark
              hover:bg-navbar-hover dark:hover:bg-navbar-hover-dark
              cursor-pointer
              transition-all duration-200 shadow-xs select-none
            "
          >
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
              {authUser?.profile_pic ? (
                <img src={getImageUrl(authUser.profile_pic) as string} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                authUser?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div className="hidden sm:flex flex-col justify-center leading-none overflow-hidden max-w-[120px] md:max-w-[160px]">
              <span className="text-xs font-semibold text-navbar-text dark:text-navbar-text-dark truncate">
                {authUser?.name || "User"}
              </span>

              <span className="text-[10px] text-text-light dark:text-gray-400 truncate capitalize mt-0.5">
                {authUser?.role || "Customer"}
              </span>
            </div>

            <MoreVertical className="text-navbar-text/60 dark:text-navbar-text-dark/60 h-4 w-4 hidden sm:block" />
          </div>

          {/* Dropdown Menu */}
          <div
            className={`
              absolute right-0 top-full mt-2 w-60 z-50 overflow-hidden rounded-2xl
              bg-navbar-bg dark:bg-navbar-bg-dark
              border border-navbar-border dark:border-navbar-border-dark
              shadow-xl backdrop-blur-md
              py-2 transition-all duration-200 origin-top-right
              ${
                menuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }
            `}
          >
            {/* User Info inside dropdown for mobile screens */}
            <div className="px-4 py-3 border-b border-navbar-border dark:border-navbar-border-dark sm:hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{authUser?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{authUser?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 capitalize">
                {authUser?.role}
              </span>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                setProfileOpen(true);
              }}
              className="group flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-navbar-text dark:text-navbar-text-dark hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <User className="h-4 w-4" />
                </div>
                <span>My Profile</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                setChangePasswordOpen(true);
              }}
              className="group flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-navbar-text dark:text-navbar-text-dark hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Key className="h-4 w-4" />
                </div>
                <span>Change Password</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-1" />
            </button>

            <div className="my-1.5 border-t border-navbar-border dark:border-navbar-border-dark" />

            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="group flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <LogOut className="h-4 w-4" />
                </div>
                <span>Logout</span>
              </div>
              <ChevronRight className="h-4 w-4 text-red-400 transition group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
      
      <ChangePasswordModal open={changePasswordOpen} setOpen={setChangePasswordOpen} />
      <ProfileModal open={profileOpen} setOpen={setProfileOpen} /> 
    </header>
  );
};

export default DashboardNavbar;
