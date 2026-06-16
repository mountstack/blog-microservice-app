import { Request, Response } from "express"; 
import { Comment } from "../entities/Comment"; 
import { appDataSource } from "../config/database"; 
import { publishEvent } from '../config/rabbitmq';


const commentRepository = appDataSource.getRepository(Comment); 

export const createComment = async (req: Request, res: Response) => { 
  const { content, postId } = req.body; 
  const userId = (req as any).user?.id; 
  
  if(!content) return res.status(400).json({ message: "Content is required" }); 
  if(!postId) return res.status(400).json({ message: "Post ID is required" }); 

  try { 
    const comment = commentRepository.create({ content, postId, userId }); 
    await commentRepository.save(comment); 

    // Publish Event 
    publishEvent({ 
      type: 'CommentCreated', 
      data: { 
        id: comment?.id, 
        content: content, 
        postId: postId, 
        userId: userId 
      } 
    }); 
    // --- END --- 

    res.json({ 
      message: 'Comment created successfully!', 
      comment 
    }) 
  } 
  catch (error: any) { 
    console.log(error);
    return res.json({message: error.message}); 
  } 
} 
