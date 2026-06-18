import { CreatePostForm } from "@/components/posts/CreatePostForm";

interface Post {
  id: string
  title: string 
}

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
    <div className="max-w-175 mx-auto mt-8"> 
      { 
        <div> 
          <p className="mb-3 font-bold"> 
            Create a new post 
          </p> 
          <CreatePostForm /> 
        </div> 
      } 

      <h2 className="text-2xl font-bold pt-10 mb-4">Posts</h2> 
      { 
        posts.length === 0 ? ( 
          <p>No posts found</p> 
        ) : 
        ( 
          <ul className="space-y-4"> 
            {posts?.map((post: Post) => (
              <li key={post.id} className="border p-4 rounded-lg">
                <h3 className="text-xl font-semibold">{post.title}</h3> 
              </li>
            ))}
          </ul>
        ) 
      } 
    </div> 
  ) 
} 