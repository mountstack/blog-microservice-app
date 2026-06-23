"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores/authstore";
import { ActivePostFormModal } from "./ActivePostFormModal";

export function CreatePostForm() {
  const { user } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false); 

  const isLoggedIn = !!user;

  const handleInputClick = () => {
    if (isLoggedIn) {
      setModalOpen(true);
    }
  } 

  return (
    <>
      <div className="rounded-lg border bg-white p-4 dark:bg-gray-800">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 space-y-3">
              {isLoggedIn ? (
                <>
                  <Label htmlFor="title" className="sr-only">
                    Title
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Post title..."
                    onClick={handleInputClick}
                    readOnly
                    className="h-10 cursor-pointer border-none bg-gray-100 px-3 text-base font-medium placeholder:text-gray-400 focus-visible:ring-0 dark:bg-gray-900"
                  />
                </>
              ) : (
                <div className="py-4 text-center text-gray-500">
                  <p className="text-sm">Login to create a post</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end border-t pt-3 dark:border-gray-700">
            <Button
              type="button"
              onClick={handleInputClick}
              disabled={!isLoggedIn}
              className="min-w-30 cursor-pointer"
            >
              Create Post
            </Button>
          </div>
        </div>
      </div>

      <ActivePostFormModal
        open={modalOpen}
        onOpenChange={setModalOpen} 
      />
    </>
  )
} 