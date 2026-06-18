"use client"; 

import { useState } from "react"; 
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"; 
import { Label } from "@/components/ui/label"; 
import { Button } from "@/components/ui/button"; 
import { useAuthStore } from "@/lib/stores/authstore"; 

export function CreatePostForm() { 
  const router = useRouter(); 
  const { user, accessToken } = useAuthStore(); 
  const [title, setTitle] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 

  const isLoggedIn = !!user; 

  const handleSubmit = async (e: any) => { 
    e.preventDefault(); 
    
    if (!isLoggedIn) return; 
    
    if (!title.trim()) { 
      setError("Title and content are required"); 
      return; 
    } 

    setError(null); 
    setIsLoading(true); 

    try {
      const response = await fetch("http://localhost:8000/post", { 
        method: "POST", 
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": accessToken  || "", 
        }, 
        body: JSON.stringify({ 
          title: title.trim() 
        }), 
        credentials: "include", 
      }) 

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || "Failed to create post"); 
      }

      setTitle(""); 
      router.refresh(); 
    } 
    catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong"); 
    } 
    finally {
      setIsLoading(false); 
    }
  }

  return (
    <div className="rounded-lg border bg-white p-4 dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-3">
            {isLoggedIn ? 
            (
              <> 
                <Label htmlFor="title" className="sr-only">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 border-none bg-gray-50 px-0 text-base font-medium placeholder:text-gray-400 focus-visible:ring-0 dark:bg-gray-900"
                /> 
              </> 
            ) : 
            (
              <div className="py-4 text-center text-gray-500">
                <p className="text-sm">Login to create a post</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end border-t pt-3 dark:border-gray-700">
          <Button
            type="submit"
            disabled={!isLoggedIn || isLoading || !title.trim()}
            className="min-w-30 cursor-pointer"
          > 
            {isLoading ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}