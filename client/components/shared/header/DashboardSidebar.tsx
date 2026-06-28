"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  FileText,
  MessageCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/authstore";

interface DashboardSidebarProps {
  open: boolean;
}

export function DashboardSidebar({ open }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: "Web View", href: "/", icon: LayoutDashboard },
    { name: "Profile", href: "/profile", icon: User },
    // { name: "My Posts", href: "/posts", icon: FileText },
    // { name: "Comments", href: "/comments", icon: MessageCircle },
    // { name: "Settings", href: "/settings", icon: Settings },
  ];

  return ( 
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900",
        open ? "w-64" : "w-20"
      )}
    > 
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                !open && "justify-center"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-700 dark:text-blue-400" : "text-gray-500")} />
              {open && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav> 

      {/* Bottom */}
      <div className="border-t p-4 dark:border-gray-800 cursor-pointer hover:bg-gray-200/70">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {open && (
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                {user?.email || ""}
              </p>
            </div>
          )} 
          <button
            onClick={logout}
            className={cn(
              "rounded-lg p-2 cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800",
              !open && "mx-auto"
            )}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
} 