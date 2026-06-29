import "reflect-metadata";

import dotenv from "dotenv";
import { DataSource } from "typeorm"; 
import { UserProjection } from "../APIs/entities/UserProjection";
import { PostProjection } from "../APIs/entities/PostProjection";
import { Comment } from "../APIs/entities/Comment";

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
  entities: [UserProjection, PostProjection, Comment] 
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