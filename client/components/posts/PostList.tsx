import { PostCard } from "./PostCard"

interface Post { 
  id: number 
  title: string 
  totalComments: number 
  createdAt: Date 
  user: {  
    id: number 
    name: string 
    avatarUrl: string | null 
  } 
} 

interface PostListProps { 
  open: boolean 
  posts: Post[] 
  onCommentClick: (post: Post) => void 
} 

const bgColors = [
  "bg-gradient-to-r from-pink-500 to-rose-600",
  "bg-gradient-to-r from-gray-600 to-black",
  "bg-gradient-to-r from-teal-400 to-emerald-900",
  "bg-gradient-to-r from-fuchsia-800 to-pink-700",
] 

export function PostList({ open, posts, onCommentClick }: PostListProps) {
  if (posts.length === 0) {
    return <p>Posts not available</p>
  } 

  return (
    <ul className="space-y-4">
      {posts.map((post: Post, index: number) => {
        const bgColor = bgColors[index % bgColors.length]
        return (
          <PostCard 
            key={post.id} 
            open={open} 
            post={post} 
            bgColor={bgColor} 
            onCommentClick={() => onCommentClick(post)} 
          /> 
        ) 
      })} 
    </ul> 
  ) 
} 