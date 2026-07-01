"use client"

import { useState } from "react"
import { useAuthStore } from "@/lib/stores/authstore"
import { apiFetch } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

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

interface CommentFormProps { 
  post: Post 
} 

export function CommentForm({ post }: CommentFormProps) { 
  const { user } = useAuthStore()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLoggedIn = !!user; 

  const handleSubmit = async (e: React.SyntheticEvent) => { 
    e.preventDefault(); 

    if (!isLoggedIn) return; 
    if (!content.trim()) return; 

    setIsLoading(true); 
    setError(null); 

    try {
      await apiFetch("/comment", {
        method: "POST",
        body: JSON.stringify({
          content: content.trim(),
          postId: post.id
        }),
      })

      setContent(""); 
      post.totalComments += 1; 
    } 
    catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } 
    finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) { 
    return ( 
      <div className="py-2 text-center text-sm text-gray-500 dark:text-gray-400"> 
        <Link href="/login" className="text-blue-600 hover:underline"> 
          Login 
        </Link>{" "} 
        to comment 
      </div> 
    ) 
  } 

  return ( 
    <form onSubmit={handleSubmit} className="flex items-center gap-3"> 
      <Avatar className="h-8 w-8"> 
        <AvatarImage src={user?.avatarUrl || undefined} alt={user?.name || "User"} /> 
        <AvatarFallback className="bg-gray-300 text-xs font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300">
          {user?.name?.charAt(0).toUpperCase() || "U"} 
        </AvatarFallback> 
      </Avatar> 

      <Input 
        type="text" 
        placeholder="Write a comment..." 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        className="flex-1 h-9 text-sm" 
        disabled={isLoading} 
      /> 

      <Button
        type="submit"
        size="sm"
        disabled={!content.trim() || isLoading}
        className="cursor-pointer"
      >
        {isLoading ? "Posting..." : "Post"}
      </Button>
    </form>
  )
}