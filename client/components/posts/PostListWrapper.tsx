"use client"; 

import { useState } from "react"; 
import { PostList } from "./PostList"; 
import { CommentModal } from "./comments/CommentModal"; 

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

interface PostListWrapperProps {
  posts: Post[]
}

export function PostListWrapper({ posts }: PostListWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); 

  const handleCommentClick = (post: Post) => { 
    setSelectedPost(post); 
    setIsModalOpen(true); 
  } 

  return ( 
    <> 
      <PostList open={isModalOpen} posts={posts} onCommentClick={handleCommentClick} />

      {selectedPost && (
        <CommentModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          post={selectedPost}
          bgColor={selectedPost.bgColor} 
        />
      )}
    </>
  ) 
}