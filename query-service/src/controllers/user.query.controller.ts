import { Request, Response } from "express";
import { appDataSource } from "../config/database"; 
import { UserProjection } from '../entities/UserProjection';

export const findUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = appDataSource.getRepository(UserProjection);

    const users = await userRepository.find({ 
      order: { createdAt: "DESC" } 
    }); 

    return res.status(200).json(users); 
  }  
  catch (error: any) {
    console.error("[Query Service - findUsers Error]:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const findUserById = async (req: Request, res: Response) => { 
  try { 
    const userId = parseInt((req as any).params.id, 10); 

    if (!userId) { 
      return res.status(400).json({ message: "Invalid user identity parameter." });
    } 

    const userRepository = appDataSource.getRepository(UserProjection);
    
    const userProfile = await userRepository.findOne({
      where: { id: userId }
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile record not found." });
    }

    return res.status(200).json(userProfile);
  } 
  catch (error: any) {
    console.error("[Query Service - findUserById Error]:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};