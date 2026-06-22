"use client"; 

import { useState } from "react"; 
import { PostList } from "./PostList"; 
import { CommentModal } from "./comments/CommentModal"; 

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

interface PostListWrapperProps {
  posts: Post[]
}

const bgColors = [
  "bg-gradient-to-r from-pink-500 to-rose-600",
  "bg-gradient-to-r from-gray-600 to-black",
  "bg-gradient-to-r from-teal-400 to-emerald-900",
  "bg-gradient-to-r from-fuchsia-800 to-pink-700",
]

export function PostListWrapper({ posts }: PostListWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); 

  const handleCommentClick = (post: Post) => { 
    setSelectedPost(post); 
    setIsModalOpen(true); 
  } 

  const getBgColor = (index: number) => { 
    return bgColors[index % bgColors.length]; 
  } 

  return (
    <>
      <PostList open={isModalOpen} posts={posts} onCommentClick={handleCommentClick} />

      {selectedPost && (
        <CommentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          post={selectedPost}
          bgColor={getBgColor(posts.indexOf(selectedPost))}
        />
      )}
    </>
  )
} 