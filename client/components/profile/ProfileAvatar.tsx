"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authstore";
import { apiFetch, apiFetchFormData } from "@/lib/api/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  name: string;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

export function ProfileAvatar({ avatarUrl, name, onAvatarUpdate }: ProfileAvatarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPEG, PNG, GIF, and WEBP images are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload to file service using apiFetchFormData
      const result = await apiFetchFormData("/file/upload?feature=user", formData);
      const newAvatarUrl = result.data.url;

      console.log({newAvatarUrl});

      // Update profile with new avatar
      await apiFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          avatarUrl: newAvatarUrl,
        }),
      });

      // Notify parent
      onAvatarUpdate(newAvatarUrl);
      setPreviewUrl(null);

    } 
    catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
      setPreviewUrl(null);
    } 
    finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Show preview if uploading, otherwise show avatarUrl
  const displayUrl = previewUrl || avatarUrl || undefined;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Avatar className="h-24 w-24">
        <AvatarImage src={displayUrl} />
        <AvatarFallback className="text-2xl">
          {name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      {/* Hover Overlay - Show Change button */}
      {isHovering && !isUploading && (
        <button
          onClick={handleClick}
          className="absolute cursor-pointer bottom-0 left-0 right-0 flex items-center justify-center gap-1 rounded-b-full bg-black/60 py-1.5 text-xs font-medium text-white transition-opacity hover:bg-black/70"
        >
          <Camera className="h-3.5 w-3.5" />
          Change
        </button>
      )} 

      {/* Uploading State - Spinner overlay */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}