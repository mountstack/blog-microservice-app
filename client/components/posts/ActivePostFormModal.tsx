"use client"

import { useState } from "react"; 
import { useRouter } from "next/navigation"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; 
import { apiFetch } from "@/lib/api/client"; 
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { useAuthStore } from "@/lib/stores/authstore"; 

interface ActivePostFormModalProps { 
  open: boolean 
  onOpenChange: (open: boolean) => void 
  onPostCreated: () => void 
} 

const bgColors = [ 
  { name: "Black", value: "bg-gradient-to-r from-gray-600 to-black" }, 
  { name: "Purple", value: "bg-gradient-to-r from-fuchsia-800 to-pink-700" }, 
  { name: "Teal", value: "bg-gradient-to-r from-teal-600 to-emerald-800" }, 
  { name: "Blue", value: "bg-gradient-to-r from-blue-700 to-indigo-900" }, 
  { name: "Pink", value: "bg-gradient-to-r from-pink-600 to-rose-700" }, 
  { name: "Orange", value: "bg-gradient-to-r from-orange-700 to-red-800" }, 
]; 

export function ActivePostFormModal({ open, onOpenChange, onPostCreated }: ActivePostFormModalProps) {
  const router = useRouter(); 
  const { user } = useAuthStore(); 
  const [title, setTitle] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [selectedColor, setSelectedColor] = useState(bgColors[0].value); 

  const isLoggedIn = !!user

  const handleSubmit = async (e: React.SyntheticEvent) => { 
    e.preventDefault(); 

    if (!isLoggedIn) return; 
    if (!title.trim()) { 
      setError("Title is required"); 
      return; 
    } 

    setError(null); 
    setIsLoading(true); 

    try { 
      await apiFetch("/post", { 
        method: "POST", 
        body: JSON.stringify({ 
          title: title.trim(), 
          bgColor: selectedColor, 
        }), 
      }) 

      setTitle(""); 
      setSelectedColor(bgColors[0].value); 
      onOpenChange(false); 
      onPostCreated(); 
      router.refresh(); 
    } 
    catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } 
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Create a new post
          </DialogTitle>
        </DialogHeader> 

        <form onSubmit={handleSubmit} className="space-y-6"> 
          <div className={`flex min-h-70 max-h-100 items-center justify-center rounded-lg p-5 ${selectedColor}`}>
            <p className="text-center text-xl font-semibold text-white">
              {title || "Your post preview"}
            </p>
          </div>

          <Input
            type="text"
            placeholder="Post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 text-base"
            autoFocus
          />

          <div>
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose background color:
            </p>
            <div className="flex flex-wrap gap-3">
              {bgColors?.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-10 w-10 rounded-full border-2 cursor-pointer transition-all ${
                    selectedColor === color.value
                      ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2"
                      : "border-transparent hover:border-gray-400"
                  }`}
                >
                  <div className={`h-full w-full rounded-full ${color.value}`} />
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="min-w-30 cursor-pointer"
            >
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 