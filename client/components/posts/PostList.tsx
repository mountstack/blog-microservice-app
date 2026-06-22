import { PostCard } from "./PostCard"

interface Post { 
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

interface PostListProps { 
  open: boolean 
  posts: Post[] 
  onCommentClick: (post: Post) => void 
} 

export function PostList({ open, posts, onCommentClick }: PostListProps) {
  if (posts.length === 0) {
    return <p>Posts not available</p>
  } 

  return (
    <ul className="space-y-4">
      {posts.map((post: Post) => {
        return (
          <PostCard 
            key={post.id} 
            open={open} 
            post={post} 
            bgColor={post.bgColor} 
            onCommentClick={() => onCommentClick(post)} 
          /> 
        ) 
      })} 
    </ul> 
  ) 
}