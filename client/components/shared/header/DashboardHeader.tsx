// components/shared/navbar/DashboardHeader.tsx

"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export function DashboardHeader({ onMenuClick, sidebarOpen }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
      {/* Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="mr-2"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
        <span>📝</span>
        <span>Mount<span className="text-blue-600">Blog</span></span>
      </Link>
    </header>
  );
}