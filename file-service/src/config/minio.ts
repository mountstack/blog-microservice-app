import dotenv from "dotenv"; 
import * as Minio from "minio";  

dotenv.config();

const useSSL = JSON.parse(process.env.MINIO_USE_SSL || "false"); 

export const minioClient = new Minio.Client({
  useSSL: useSSL,
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const BUCKET_NAME = process.env.MINIO_BUCKET || "microservice-blog-files";

export const ensureBucket = async () => { 
  try { 
    const exists = await minioClient.bucketExists(BUCKET_NAME); 
    if (!exists) { 
      await minioClient.makeBucket(BUCKET_NAME, ""); 
      console.log(`Bucket "${BUCKET_NAME}" created`); 
    }  
    else { 
      console.log(`Bucket "${BUCKET_NAME}" already exists`); 
    } 
  } 
  catch (error) { 
    console.error("Error ensuring bucket:", error); 
    throw error; 
  } 
}; 

export { BUCKET_NAME }; 