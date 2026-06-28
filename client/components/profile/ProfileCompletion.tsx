"use client";

interface ProfileCompletionProps {
  completion: number;
}

export function ProfileCompletion({ completion }: ProfileCompletionProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">Profile Completion</span>
        <span className="text-gray-500">{completion}%</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{ width: `${completion}%` }}
        />
      </div>
    </div>
  );
}