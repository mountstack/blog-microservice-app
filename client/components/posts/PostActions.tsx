interface PostActionsProps {
  postId: number
  totalComments: number
  onCommentClick: () => void
}

export function PostActions({ postId, totalComments, onCommentClick }: PostActionsProps) {
  return (
    <div className="mt-4 flex items-center justify-between border-t pt-3 dark:border-gray-700">
      <div className="flex items-center gap-6">
        <button className="cursor-pointer flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
          <span>👍</span> Like
        </button>
        <button
          onClick={onCommentClick}
          className="cursor-pointer flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <span>💬</span> Comment
        </button>
        <button className="cursor-pointer flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
          <span>👥</span> Share
        </button>
      </div>

      {totalComments > 0 && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {totalComments} {totalComments === 1 ? "comment" : "comments"}
        </span>
      )}
    </div>
  )
}