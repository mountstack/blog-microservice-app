import multer from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();

const limits = { 
  fileSize: 5 * 1024 * 1024 
}; 

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  
  if (allowedMimes.includes(file.mimetype)) { 
    cb(null, true); 
  } 
  else { 
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, WEBP, SVG are allowed")); 
  } 
}; 

export const upload = multer({ storage, fileFilter, limits }); 