"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface ProfileHeaderProps {
  onEdit: () => void;
}

export function ProfileHeader({ onEdit }: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-sm text-gray-500">Manage your personal information</p>
      </div>
      <Button onClick={onEdit} className="cursor-pointer">
        <Pencil className="mr-2 h-4 w-4" />
        Edit Profile
      </Button>
    </div>
  ); 
} 