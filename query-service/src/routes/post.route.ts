import express from 'express';
import { findPostById, findPosts } from '../controllers/post.query.controller';

export const postRouter = express.Router(); 

postRouter.get('/', findPosts); 
postRouter.get('/:id', findPostById); 