interface PostHeaderProps {
  user: {
    id: number
    name: string
    avatarUrl: string | null
  }
  createdAt: Date
}

export function PostHeader({ user, createdAt }: PostHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      {user?.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name || "User"}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      )}

      {/* User Name & Time */}
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white">
          {user?.name || "Unknown User"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}{" "}
          at{" "}
          {new Date(createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>
    </div>
  )
} 