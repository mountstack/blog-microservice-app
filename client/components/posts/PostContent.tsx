interface PostContentProps {
  title: string
  bgColor: string
  open: boolean
}

export function PostContent({ open, title, bgColor }: PostContentProps) {
  return ( 
    <div className={`mt-3 flex min-h-80  items-center justify-center rounded-lg p-5 ${bgColor}`}> 
      <h3 className="text-center text-3xl font-semibold text-white"> 
        {title} 
      </h3> 
    </div> 
  ) 
} 