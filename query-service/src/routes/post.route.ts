import express from 'express';
import { findPostById, findPosts, findCommentsByPostId } from '../controllers/post.query.controller';

export const postRouter = express.Router(); 

postRouter.get('/', findPosts); 
postRouter.get('/:id/comments', findCommentsByPostId); 
postRouter.get('/:id', findPostById); 