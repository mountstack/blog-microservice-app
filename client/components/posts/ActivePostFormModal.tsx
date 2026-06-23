"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/stores/authstore"
import { apiFetch } from "@/lib/api/client"

interface ActivePostFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void 
}

const bgColors = [
  { name: "Black", value: "bg-gradient-to-r from-gray-600 to-black" },
  { name: "Purple", value: "bg-gradient-to-r from-fuchsia-800 to-pink-700" },
  { name: "Teal", value: "bg-gradient-to-r from-teal-600 to-emerald-800" },
  { name: "Blue", value: "bg-gradient-to-r from-blue-700 to-indigo-900" },
  { name: "Pink", value: "bg-gradient-to-r from-pink-600 to-rose-700" },
  { name: "Orange", value: "bg-gradient-to-r from-orange-700 to-red-800" },
]

const getColorStyle = (bgClass: string) => {
  const colorMap: Record<string, string> = {
    "bg-gradient-to-r from-gray-600 to-black": "linear-gradient(135deg, #4b5563, #000000)",
    "bg-gradient-to-r from-fuchsia-800 to-pink-700": "linear-gradient(135deg, #a21caf, #be185d)",
    "bg-gradient-to-r from-teal-600 to-emerald-800": "linear-gradient(135deg, #0d9488, #065f46)",
    "bg-gradient-to-r from-blue-700 to-indigo-900": "linear-gradient(135deg, #1d4ed8, #312e81)",
    "bg-gradient-to-r from-pink-600 to-rose-700": "linear-gradient(135deg, #db2777, #be123c)",
    "bg-gradient-to-r from-orange-700 to-red-800": "linear-gradient(135deg, #c2410c, #991b1b)",
  }
  return colorMap[bgClass] || "linear-gradient(135deg, #4b5563, #000000)"
}

export function ActivePostFormModal({ open, onOpenChange }: ActivePostFormModalProps) {
  const { user } = useAuthStore()
  const [title, setTitle] = useState("")
  const [selectedColor, setSelectedColor] = useState<string>(bgColors[0].value)
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null); 

  const { accessToken } = useAuthStore.getState(); 

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, GIF, and WEBP images are allowed")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setImagePreview(URL.createObjectURL(file))
    setError(null)
    await uploadImage(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
      'image/webp': [],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  })
  

  const uploadImage = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData(); 
      formData.append("file", file); 


      const response = await fetch("http://localhost:8000/file/upload?feature=post", {
        method: "POST",
        headers: { 
          "Authorization": accessToken || "", 
        }, 
        body: formData 
      }) 

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to upload image")
      }

      const result = await response.json()
      setImageUrl(result.data.url)
    } 
    catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
      setImagePreview(null)
    } 
    finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageUrl(null)
    setError(null)
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault(); 

    if (!title.trim()) { 
      setError("Title is required"); 
      return; 
    } 

    setError(null); 
    setIsLoading(true); 

    try {
      const payload: any = {
        title: title.trim(),
        bgColor: selectedColor,
      }

      if (imageUrl) {
        payload.imageUrl = imageUrl
      }

      await apiFetch("/post", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      setSuccessMessage('Post created successfully');

      setTimeout(() => { 
        setTitle(""); 
        setSuccessMessage(null); 
        setImagePreview(null); 
        setImageUrl(null); 
        onOpenChange(false); 
        setSelectedColor(bgColors[0].value); 
      }, 1200) 
    } 
    catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } 
    finally {
      setIsLoading(false)
    }
  }

  // Disable only if uploading OR submitting. Image is NOT required.
  const isDisabled = !title.trim() || isUploading || isLoading

  // Dynamic height: 320px if no image, 150px if image uploaded
  const titleHeight = imagePreview ? "100px" : "250px"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-h-[65vh] max-h-[90vh] overflow-y-auto md:min-w-225">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            ✏️ Create a new post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* POST COLUMN - Left */}
            <div className="space-y-4 flex flex-col">
              <div className="flex-1">
                <div
                  {...getRootProps()}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <span className="text-4xl">📤</span>
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    {isDragActive ? "Drop image here" : "Drag & drop image here"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isDragActive ? "" : "or click to browse"}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF, WEBP up to 5MB</p>
                </div>

                {isUploading && (
                  <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-600">
                    ⏳ Uploading image...
                  </div>
                )}
                {imageUrl && !isUploading && (
                  <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                    ✅ Image uploaded successfully
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 text-base"
                  required
                />

                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Choose background color:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {bgColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`h-10 w-10 rounded-full border-2 transition-all ${
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

                <Button
                  type="submit"
                  disabled={isDisabled}
                  className="w-full h-12 text-xl mt-5 cursor-pointer"
                >
                  {isLoading ? "Creating..." : "Create Post"}
                </Button>
              </div>
              
              {
                successMessage && 
                <span className="w-50 px-3 py-2 text-sm text-green-500 bg-green-100 border border-green-500 rounded-lg">
                  {successMessage}
                </span>
              }
            </div>

            {/* POST PREVIEW COLUMN - Right */}
            <div className="rounded-lg bg-gray-100/60 p-4 dark:bg-gray-800">
              <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                📸 Live Preview
              </p>

              <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-900">
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user?.name || `User-${user?.id}`} 
                    </p>
                    <p className="text-xs text-gray-500">Now</p>
                  </div>
                </div>

                {/* Title with BG Color - Dynamic Height */}
                <div
                  className="flex min-h-15 items-center justify-center px-4 py-5 text-center"
                  style={{ 
                    background: getColorStyle(selectedColor),
                    height: titleHeight,
                    transition: "height 0.3s ease"
                  }}
                >
                  <h4 className="text-lg font-semibold text-white">
                    {title || "Your post preview"}
                  </h4>
                </div>

                {/* Image - Only show if uploaded with close button */}
                {imagePreview && (
                  <div className="relative h-55 w-full overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 cursor-pointer flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex gap-4 px-4 py-3 text-sm text-gray-500">
                  <span>👍 Like</span>
                  <span>💬 Comment</span>
                  <span>👥 Share</span>
                  <span className="ml-auto">0 comments</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 