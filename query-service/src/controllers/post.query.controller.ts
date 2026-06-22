import "reflect-metadata";

import { Request, Response } from "express";
import { appDataSource } from "../config/database";
import { PostProjection } from "../entities/PostProjection";
import { Comment } from "../entities/Comment";

export const findPosts = async (req: Request, res: Response) => {
  try {
    const postRepository = appDataSource.getRepository(PostProjection);

    const posts = await postRepository.find({ 
      relations: { user: true }, 
      order: { 
        createdAt: "DESC" 
      } 
    }); 

    const formattedPosts = posts.map(post => ({ 
      ...post,
      user: { 
        id: post.user.id,
        name: post.user.name || `user-${post.user.id}`,
        avatarUrl: post.user.avatarUrl
      } 
    })); 

    res.json({ posts: formattedPosts }); 
  } 
  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
} 

export const findPostById = async (req: Request, res: Response) => {
  try {
    const postRepository = appDataSource.getRepository(PostProjection); 
    const postId: number = parseInt(req.params.id as string, 10); 

    const post = await postRepository.findOne({
      where: { id: postId },
      relations: {
        user: true,
        comments: { user: true }
      },
      order: { comments: { id: 'ASC' } }, 
      select: {
        id: true,
        title: true,
        totalComments: true,
        user: {
          id: true,
          name: true,
          email: true
        },
        comments: {
          id: true,
          content: true, 
          user: {
            id: true,
            name: true,
            email: true
          },
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ post });
  }
  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const findCommentsByPostId = async (req: Request, res: Response) => { 
  const commentRepository = appDataSource.getRepository(Comment); 
  const postId: number = parseInt(req.params.id as string, 10); 

  const comments = await commentRepository.find({ 
    where: { post: { id: postId } }, 
    relations: { user: true }, 
    order: { createdAt: 'DESC' }, 
    select: { 
      id: true, 
      content: true, 
      createdAt: true, 
      user: {
        id: true, 
        name: true, 
        avatarUrl: true
      }
    } 
  }); 

  res.json({ 
    data: comments
  }) 
} 
