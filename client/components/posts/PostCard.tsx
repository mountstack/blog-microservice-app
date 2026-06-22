import { PostHeader } from "./PostHeader"; 
import { PostContent } from "./PostContent"; 
import { PostActions } from "./PostActions"; 

interface PostCardProps { 
  open: boolean 
  post: {
    id: number
    title: string
    bgColor: string 
    totalComments: number
    createdAt: Date
    user: {
      id: number
      name: string
      avatarUrl: string | null
    }
  }
  bgColor: string
  onCommentClick: () => void
} 

export function PostCard({ open, post, bgColor, onCommentClick }: PostCardProps) { 
  return ( 
    <li className="rounded-lg border bg-white p-4 dark:bg-gray-800 dark:border-gray-700">
      <PostHeader user={post.user} createdAt={post.createdAt} /> 
      <PostContent open={open} title={post.title} bgColor={bgColor} /> 
      <PostActions 
        postId={post.id} 
        totalComments={post.totalComments} 
        onCommentClick={onCommentClick} 
      /> 
    </li> 
  ) 
}