interface PostContentProps {
  title: string
  imageUrl?: string | null
  bgColor: string
  open: boolean
}

export function PostContent({ open, title, imageUrl, bgColor }: PostContentProps) {
  // Dynamic title height: 180px if image exists, 320px if no image
  const titleHeight = imageUrl ? "h-45" : "h-80"

  return (
    <div className="overflow-hidden rounded-lg mt-5">
      {/* Title with BG Color - Dynamic Height */}
      <div className={`flex items-center justify-center p-6 ${bgColor} ${titleHeight}`}>
        <h3 className="text-center text-2xl font-semibold text-white leading-relaxed">
          {title}
        </h3>
      </div>

      {/* Image - Full width, below title */}
      {imageUrl && (
        <div className="w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title || "Post image"}
            className="w-full max-h-200"
          />
        </div>
      )}
    </div>
  )
}