import "reflect-metadata";

import { Request, Response } from "express";
import { appDataSource } from "../config/database";
import { PostProjection } from "../entities/PostProjection";

export const findPosts = async (req: Request, res: Response) => {
  try {
    const postRepository = appDataSource.getRepository(PostProjection);

    const posts = await postRepository.find(); 

    res.json({ posts }); 
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

