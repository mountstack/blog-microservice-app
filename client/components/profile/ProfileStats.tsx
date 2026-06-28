"use client";

interface ProfileStatsProps {
  profile: {
    totalPosts: number;
    profileCompletion: number;
    createdAt: string;
  };
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  return (
    <div className="mt-6 grid grid-cols-3 gap-4 border-t pt-6 dark:border-gray-700">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.totalPosts || 0}
        </p>
        <p className="text-sm text-gray-500">Posts</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {profile.profileCompletion || 0}%
        </p>
        <p className="text-sm text-gray-500">Profile Complete</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">Joined</p>
      </div>
    </div>
  );
} 