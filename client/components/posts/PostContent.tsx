"use client";

import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PostContentProps {
  title: string
  imageUrl?: string | null
  bgColor: string
  open: boolean
}

export function PostContent({ open, title, imageUrl, bgColor }: PostContentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Check if image is already loaded (cached)
    if (imgRef.current && imgRef.current.complete) {
      setImageLoaded(true);
    }
  }, [imageUrl]);

  const titleHeight = imageUrl ? "h-45" : "h-80";

  return (
    <div className="overflow-hidden rounded-lg mt-5">
      <div className={`flex items-center justify-center p-6 ${bgColor} ${titleHeight}`}>
        <h3 className="text-center text-2xl font-semibold text-white leading-relaxed">
          {title}
        </h3>
      </div>

      {imageUrl && (
        <div className="relative min-h-50 overflow-hidden">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 h-full w-full" />
          )}
          <img
            ref={imgRef}
            src={imageUrl}
            alt={title}
            loading="eager"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      )}
    </div>
  );
}