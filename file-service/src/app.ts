import dotenv from "dotenv"; 
import express, { Application } from "express"; 
import { ensureBucket } from "./config/minio"; 
import fileRoutes from "./routes/file.route";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8004;

app.use(express.json());

app.use("/file", fileRoutes); 


app.listen(PORT, async () => { 
  console.log(`[File-Service]: ${PORT}`); 

  try { 
    await ensureBucket(); 
    console.log("MinIO bucket ready"); 
  } 
  catch (error) { 
    console.error("Failed to start server:", error); 
    throw error; 
  } 
}); 