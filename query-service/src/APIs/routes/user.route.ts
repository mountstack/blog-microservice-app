import express from 'express'; 
import { findUserById, findUsers } from '../controllers/user.query.controller';

export const userRouter = express.Router(); 

userRouter.get('/', findUsers); 
userRouter.get('/:id', findUserById); 