import "reflect-metadata";

import dotenv from "dotenv";
import { DataSource } from "typeorm"; 
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import { Comment } from "../entities/Comment";

dotenv.config();

export const appDataSource = new DataSource({ 
  type: "postgres", 
  host: "localhost", 
  port: 5432, 
  username: "postgres", 
  password: process.env.DB_PASSWORD as string, 
  database: process.env.DB_NAME as string, 
  synchronize: true, 
  logging: ["error", "warn"], 
  entities: [User, Post, Comment] 
}); 

export async function connectDB() { 
  try { 
    await appDataSource.initialize(); 
    console.log("Database Connected"); 
  } 
  catch (error) { 
    console.log("PostgreSQL Database Connection Error:", error); 
    throw error; 
  } 
} 