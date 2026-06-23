"use client"

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PostHeader } from "../PostHeader";
import { PostContent } from "../PostContent";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useAuthStore } from "@/lib/stores/authstore";

interface CommentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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
}

export function CommentModal({ open, onOpenChange, post, bgColor }: CommentModalProps) {
  const { user } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/query/post/${post.id}/comments`);
      const data = await response.json();
      setComments(data.data);
    }
    catch (error) {
      console.error("Error fetching comments:", error)
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchComments()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-center text-lg font-semibold">
            {post?.user?.name}'s post
          </DialogTitle>
        </DialogHeader>

        <div className="border-b px-6 pb-4 dark:border-gray-700">
          <PostHeader user={post.user} createdAt={post.createdAt} />
          <PostContent open={open} title={post.title} bgColor={bgColor} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <CommentList comments={comments} isLoading={isLoading} />
        </div>

        <div className="border-t px-6 py-4 dark:border-gray-700">
          <CommentForm
            post={post}
            fetchComments={fetchComments}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 