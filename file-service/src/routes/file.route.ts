import { Router } from "express"; 
import { upload } from "../middlewares/upload"; 
import { isLoggedIn } from "../middlewares/auth"; 
import { uploadFile } from "../controllers/file.controller"; 

const router = Router(); 

router.post("/upload", isLoggedIn, upload.single("file"), uploadFile); 
// router.post("/upload", upload.single("file"), uploadFile); 

export default router; 