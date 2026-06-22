import "reflect-metadata"; 

import dotenv from "dotenv"; 
import express, { Application } from "express"; 

import { connectDB } from "./config/database"; 
import { initRabbit } from "./config/rabbitmq"; 
import { startConsumer } from './events/consumer'; 

import { postRouter } from "./routes/post.route";
import { userRouter } from "./routes/user.route";

dotenv.config(); 

const app: Application = express(); 
app.use(express.json()); 

app.use('/query/user', userRouter); 
app.use('/query/post', postRouter); 

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