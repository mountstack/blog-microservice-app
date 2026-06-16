import "reflect-metadata";

import dotenv from "dotenv";
import express, { Application } from "express"; 

import { connectDB } from "./config/database";
import { initRabbit } from "./config/rabbitmq"; 
import { isLoggedIn } from './middlewares/auth';
import { createPost } from './controllers/post.controller';

dotenv.config();

const app: Application = express(); 
app.use(express.json()); 

app.post('/post', isLoggedIn, createPost); 

const PORT = process.env.PORT || 8001;

app.listen(PORT, async () => { 
  console.log(`[Post-Service]: ${PORT}`); 
  try { 
    await connectDB(); 
    await initRabbit(); 
  } 
  catch (error) { 
    throw error; 
  } 
}); 