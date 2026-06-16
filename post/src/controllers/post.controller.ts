import { Request, Response } from "express"; 
import { appDataSource } from "../config/database";
import { Post } from "../entities/Post";
import { publishEvent } from '../config/rabbitmq';

const postRepository = appDataSource.getRepository(Post); 

export const createPost = async (req: Request, res: Response) => { 
  const { title } = req.body; 
  const userId = (req as any).user?.id; 
  
  if(!title) return res.json({message: "Title is required"}); 

  try { 
    const post = postRepository.create({ title, userId });
    await postRepository.save(post);

    // Publish Event 
    publishEvent({ 
      type: 'PostCreated', 
      data: { 
        id: post.id, 
        title: post.title, 
        userId: post.userId 
      } 
    }); 
    // --- END --- 

    res.json({ 
      message: 'Post created successfully!', 
      post 
    }) 
  } 
  catch (error: any) { 
    console.log(error);
    return res.json({message: error.message}); 
  } 
} 
