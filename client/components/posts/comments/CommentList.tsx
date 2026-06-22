import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Comment {
  id: number
  content: string
  createdAt: string
  user: {
    id: number
    name: string
    avatarUrl: string | null
  }
}

interface CommentListProps {
  comments: Comment[]
  isLoading: boolean
}

export function CommentList({ comments, isLoading }: CommentListProps) {
  if (isLoading) {
    return (
      <div className="py-4 text-center text-gray-500">
        <p className="text-sm">Loading comments...</p>
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        <p className="text-sm">No comments yet. Be the first to comment!</p>
      </div>
    )
  } 

  return (
    <div className="space-y-4 py-2">
      {comments?.map((comment) => ( 
        <div key={comment.id} className="flex items-start gap-3">
          {/* Avatar */}
          <Avatar className="h-9 w-9">
            <AvatarImage src={comment.user?.avatarUrl || undefined} alt={comment.user?.name || "User"} />
            <AvatarFallback className="bg-gray-300 text-xs font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300">
              {comment.user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          {/* Comment Content */}
          <div className="flex-1 text-left">
            <div className="rounded-2xl bg-gray-100 px-4 py-2 dark:bg-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {comment.user?.name || "Unknown User"}
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-300">
                {comment.content}
              </p>
            </div>

            {/* Comment Actions */}
            <div className="mt-1 flex items-center gap-4 px-2">
              <span className="text-xs text-gray-800 dark:text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                at{" "}
                {new Date(comment.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
              <Button variant="ghost" size="sm" className="h-auto px-0 text-xs font-medium text-gray-800 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Like
              </Button>
              <Button variant="ghost" size="sm" className="h-auto px-0 text-xs font-medium text-gray-800 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                Reply
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}