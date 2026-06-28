// components/profile/ProfileInfo.tsx

"use client";

import { Mail, Phone, User, Calendar } from "lucide-react";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileInfoProps {
  profile: {
    name: string;
    email: string;
    bio: string;
    gender: string;
    avatarUrl: string | null;
    phoneNumber: string;
    createdAt: string;
  };
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

export function ProfileInfo({ profile, onAvatarUpdate }: ProfileInfoProps) {
  return (
    <div className="flex items-start gap-6">
      <ProfileAvatar
        avatarUrl={profile.avatarUrl}
        name={profile.name}
        onAvatarUpdate={onAvatarUpdate}
      />
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.name || "User"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {profile.bio || "No bio yet"}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            {profile.email}
          </span>
          {profile.phoneNumber && (
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {profile.phoneNumber}
            </span>
          )}
          {profile.gender && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {profile.gender}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Joined {new Date(profile.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}