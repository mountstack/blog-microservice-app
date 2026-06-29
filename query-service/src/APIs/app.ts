import "reflect-metadata"; 

import dotenv from "dotenv"; 
import { createServer } from "http";
import express, { Application } from "express"; 

import { postRouter } from "./routes/post.route"; 
import { userRouter } from "./routes/user.route"; 

dotenv.config(); 

const app: Application = express(); 
export const httpServer = createServer(app); 

app.use(express.json()); 

app.use('/query/user', userRouter); 
app.use('/query/post', postRouter); 