"use client"; 

import { useState, useEffect } from "react"; 
import { PostList } from "./PostList"; 
import { CommentModal } from "./comments/CommentModal"; 
import { getSocket } from "@/lib/socket/client";
import { Socket } from "socket.io-client";

interface Post {
  id: number
  title: string
  bgColor: string 
  totalComments: number
  createdAt: Date 
  imageUrl: string 
  user: {
    id: number
    name: string
    avatarUrl: string | null
  }
}

interface PostListWrapperProps {
  posts: Post[]
}

export function PostListWrapper({ posts: allPosts }: PostListWrapperProps) { 
  const [posts, setPosts] = useState<Post[]>(allPosts); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); 

  useEffect(() => { 
    let cancelled = false;
    let socket: Socket | null = null; 

    const handlePost = (newPost: Post) => { 
      setPosts((prev) => [newPost, ...prev]); 
    } 

    getSocket()
      .then(skt => {
        if (cancelled) return;
        socket = skt; 
        socket.on('post-created', handlePost); 
      }) 
      .catch(err => { 
        console.log(err);
      })
    
    return () => { 
      cancelled = true; 
      socket?.off('post-created', handlePost); 
    } 
  }, []) 

  const handleCommentClick = (post: Post) => { 
    setSelectedPost(post); 
    setIsModalOpen(true); 
  } 

  return ( 
    <> 
      <PostList open={isModalOpen} posts={posts} onCommentClick={handleCommentClick} />

      {
        selectedPost && (
          <CommentModal
            open={isModalOpen}
            post={selectedPost}
            bgColor={selectedPost.bgColor} 
            onOpenChange={setIsModalOpen} 
          /> 
        ) 
      } 
    </> 
  ) 
} 