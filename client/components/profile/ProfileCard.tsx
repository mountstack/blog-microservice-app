"use client";

import { ProfileInfo } from "./ProfileInfo";
import { ProfileStats } from "./ProfileStats";
import { ProfileCompletion } from "./ProfileCompletion";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  bio: string;
  gender: string;
  avatarUrl: string | null;
  phoneNumber: string;
  totalPosts: number;
  createdAt: string;
  profileCompletion: number;
}

interface ProfileCardProps { 
  profile: ProfileData; 
  onAvatarUpdate: (newAvatarUrl: string) => void; 
} 

export function ProfileCard({ profile, onAvatarUpdate }: ProfileCardProps) { 
  return ( 
    <div className="rounded-lg border bg-white p-6 shadow-xs dark:bg-gray-900">
      <ProfileInfo profile={profile} onAvatarUpdate={onAvatarUpdate} />
      <ProfileStats profile={profile} />
      <ProfileCompletion completion={profile.profileCompletion || 0} />
    </div>
  );
} 