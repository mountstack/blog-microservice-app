import "reflect-metadata"; 

import dotenv from "dotenv"; 
import express, { Application } from "express"; 

import { connectDB } from "./config/database"; 
import { initRabbit } from "./config/rabbitmq"; 
import { isLoggedIn } from "./middlewares/auth"; 
import { startConsumer } from './events/consumer'; 

import { findPostById, findPosts } from "./controllers/post.controller";
import { postRouter } from "./routes/post.route";

dotenv.config(); 

const app: Application = express(); 
app.use(express.json()); 

// app.get('/query/posts', findPosts); 

// app.get('/query/posts/:id', isLoggedIn, findPostById); 

app.use('/query/posts', postRouter); 

const PORT = process.env.PORT || 8010; 

app.listen(PORT, async () => { 
  console.log(`[Query-Service]: ${PORT}`); 
  try { 
    await connectDB(); 
    await initRabbit(startConsumer); 
  } 
  catch (error) { 
    throw error; 
  } 
}); 