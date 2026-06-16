import "reflect-metadata";

import dotenv from "dotenv"; 
import express, { Application } from "express"; 
import { connectDB } from "./config/database"; 
import { isLoggedIn } from "./middlewares/auth"; 
import { createComment } from "./controllers/comment.controller"; 
import { initRabbit } from "./config/rabbitmq";

dotenv.config();

const app: Application = express(); 
app.use(express.json()); 

app.post('/comment', isLoggedIn, createComment); 

const PORT = process.env.PORT || 8002;

app.listen(PORT, async () => { 
  console.log(`[Comment-Service]: ${PORT}`); 

  try { 
    await connectDB(); 
    await initRabbit(); 
  } 
  catch (error) { 
    throw error; 
  } 
}) 