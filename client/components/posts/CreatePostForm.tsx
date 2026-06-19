"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/authstore";
import { apiFetch } from "@/lib/api/client";

export function CreatePostForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(100);
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
      const response = await apiFetch("/post", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim()
        }),
      })

      setTitle("");
      // setMessage('Created Successfully'); 
      // setTimeout(() => setMessage(''), 3000); 

      setMessage('Created Successfully');
      setProgress(0);

      const startTime = Date.now();
      const duration = 3000;

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressValue = Math.min(100, (elapsed / duration) * 100);
        setProgress(progressValue);

        if (progressValue >= 100) {
          clearInterval(timer);
          setMessage('');
        }
      }, 16);
      router.refresh();
    }
    catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <>
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
                      className="h-10 border-none bg-gray-100 px-3 text-base font-medium placeholder:text-gray-400 focus-visible:ring-0 dark:bg-gray-900"
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

      {
        message && (
          <div className="my-5 w-50">
            <div className="rounded-lg border-2 border-green-400 bg-green-100 px-3 py-2">
              <p className="text-sm font-bold text-green-600">
                {message}
              </p>
              {/* Progress bar */}
              <div className="mt-2 h-1 w-full rounded-full bg-green-200">
                <div
                  className="h-1 rounded-full bg-green-600 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )
      }
    </>
  )
} 