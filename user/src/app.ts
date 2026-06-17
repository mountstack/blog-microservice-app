import "reflect-metadata";

import dotenv from "dotenv";
import express, { Application } from "express";
import cookieParser from "cookie-parser"; 
import { connectDB } from "./config/database";
import { login, registration, generateRefreshToken } from "./controllers/auth.controller";
import { initRabbit } from "./config/rabbitmq";
import { updateProfile } from "./controllers/profile.controller";
import { isLoggedIn } from "./middlewares/auth";

dotenv.config();

const app: Application = express(); 

app.use(express.json()); 
app.use(cookieParser()); 

app.post("/user/login", login);
app.post("/user/registration", registration);
app.post("/user/refresh-token", generateRefreshToken);

app.patch('/profile', isLoggedIn, updateProfile); 


const PORT = process.env.PORT || 8003;

app.listen(PORT, async () => { 
  console.log(`[User-service]: ${PORT}`); 
  
  try { 
    await connectDB(); 
    await initRabbit(); 
  } 
  catch (error) { 
    throw error; 
  } 
}); 
