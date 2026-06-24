import { CreatePostForm } from "@/components/posts/CreatePostForm"; 
import { PostListWrapper } from "@/components/posts/PostListWrapper"; 

export default async function Page() { 
  const response = await fetch("http://localhost:8000/query/post", { 
    next: { revalidate: 0 } 
  }) 

  if (!response.ok) { 
    throw new Error("Failed to fetch posts"); 
  } 

  const data = await response.json(); 
  let posts = data.posts || data; 

  return ( 
    <div className="mx-auto my-10 max-w-2xl"> 
      <div> 
        <p className="mb-3 text-xl font-bold">Create a new post</p> 
        <CreatePostForm /> 
      </div> 

      <h2 className="mb-4 pt-10 text-xl font-bold">Posts</h2> 
      <PostListWrapper posts={posts} />  
    </div> 
  ) 
} 