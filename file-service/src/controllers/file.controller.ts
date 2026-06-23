import path from "path"; 
import { nanoid } from "nanoid"; 
import { Request, Response } from "express"; 
import { minioClient, BUCKET_NAME } from "../config/minio"; 

export const uploadFile = async (req: Request, res: Response) => { 
  try { 
    const file = (req as any).file; 
    const feature = req.query.feature as string || "others"; // user, post

    if (!file) { 
      return res.status(400).json({ 
        success: false, 
        message: "Currupted file. Upload again.", 
      }); 
    } 

    const fileExtension = path.extname(file.originalname); 
    // const uniqueFilename = `user-${uuidv4()}${fileExtension}`; 
    const uniqueFilename = `user-${nanoid(10)}${fileExtension}`; 
    const filePath = `${feature}/${uniqueFilename}`; 

    await minioClient.putObject( 
      BUCKET_NAME,
      filePath,
      file.buffer,
      file.size,
      { "Content-Type": file.mimetype }
    ); 

    const url = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${filePath}`;

    return res.status(201).json({ 
      success: true, 
      message: "File uploaded successfully", 
      data: { 
        url: url, 
        filename: uniqueFilename, 
        originalName: file.originalname, 
        size: file.size, 
        mimeType: file.mimetype, 
      } 
    }); 
  } 
  catch (error: any) { 
    console.error("Upload error:", error); 
    return res.status(500).json({ 
      success: false, 
      message: "Failed to upload file", 
      error: error.message, 
    }); 
  } 
}; 

// export const deleteFile = async (req: Request, res: Response) => {
//   try {
//     const { filename } = req.params;
//     const userId = req.userId;

//     const filePath = `users/${userId}/files/${filename}`;

//     try {
//       await minioClient.statObject(BUCKET_NAME, filePath);
//     } catch (error) {
//       return res.status(404).json({
//         success: false,
//         message: "File not found",
//       });
//     }

//     await minioClient.removeObject(BUCKET_NAME, filePath);

//     return res.status(200).json({
//       success: true,
//       message: "File deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete file",
//     });
//   }
// };

// export const getFileUrl = async (req: Request, res: Response) => {
//   try {
//     const { filename } = req.params;
//     const userId = req.userId;

//     const filePath = `users/${userId}/files/${filename}`;

//     try {
//       await minioClient.statObject(BUCKET_NAME, filePath);
//     } catch (error) {
//       return res.status(404).json({
//         success: false,
//         message: "File not found",
//       });
//     }

//     const url = `http://${process.env.MINIO_ENDPOINT || "localhost"}:${process.env.MINIO_PORT || "9000"}/${BUCKET_NAME}/${filePath}`;

//     return res.status(200).json({
//       success: true,
//       data: { url },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to get file URL",
//     });
//   }
// };