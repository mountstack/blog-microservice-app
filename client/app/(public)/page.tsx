import { CreatePostForm } from "@/components/posts/CreatePostForm";

interface Post {
  id: number
  title: string
  totalComments: number
  createdAt: Date
  user: {
    id: number
    name: string
    avatarUrl: string
  }
}

const bgColors = [
  "bg-gradient-to-r from-pink-500 to-rose-600", 
  "bg-gradient-to-r from-gray-600 to-black to-black", 
  "bg-gradient-to-r from-teal-400 to-emerald-900", 
  "bg-gradient-to-r from-fuchsia-800 to-pink-700",
]; 

export default async function Page() {
  const response = await fetch("http://localhost:8000/query/post", {
    next: { revalidate: 0 }
  })

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await response.json();
  const posts = data.posts || data;

  return (
    <div className="max-w-175 mx-auto my-10">
      {
        <div>
          <p className="mb-3 text-xl font-bold">
            Create a new post
          </p>
          <CreatePostForm />
        </div>
      }

      <h2 className="text-xl font-bold pt-10 mb-4">Posts</h2> 
      { 
        posts.length === 0 ? ( 
          <p>No posts found</p> 
        ) : 
          ( 
            <ul className="space-y-4"> 
              {posts?.map((post: Post, index: number) => { 
                const bgColor = bgColors[index % bgColors.length]; 

                return (
                  <li key={post.id} className="rounded-lg border bg-white p-4 dark:bg-gray-100 dark:border-gray-800">
                    {/* Post Header - User Info */}
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      {post.user?.avatarUrl ? (
                        <img
                          src={post.user.avatarUrl}
                          alt={post.user.name || "User"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300">
                          {post.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )} 

                      {/* User Name & Time */}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {post.user?.name || "Unknown User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(post.createdAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Post Content with Dynamic Background */}
                    <div className={`mt-3 p-5 flex min-h-80 items-center justify-center rounded-lg ${bgColor}`}>
                      <h3 className="text-center text-3xl font-semibold text-white">
                        {post.title} 
                      </h3> 
                    </div> 

                    {/* Post Footer - Actions */}
                    <div className="mt-4 flex items-center justify-between border-t pt-3 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                          <span>👍</span> Like
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                          <span>💬</span> Comment
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                          <span>👥</span> Share
                        </button>
                      </div>

                      {/* Total Comments */}
                      {post.totalComments > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.totalComments} {post.totalComments === 1 ? "comment" : "comments"}
                        </span>
                      )}
                    </div>
                  </li>
                ) 
              })} 
            </ul> 
          ) 
      } 
    </div> 
  ) 
} 