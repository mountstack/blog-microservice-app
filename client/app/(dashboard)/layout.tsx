// app/(dashboard)/layout.tsx

"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/shared/header/DashboardHeader";
import { DashboardSidebar } from "@/components/shared/header/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950"> 
      <DashboardHeader onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />

      <div className="flex flex-1 overflow-hidden"> 
        <DashboardSidebar open={sidebarOpen} /> 
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}