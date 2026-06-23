import jwt from 'jsonwebtoken'; 
import { Request, Response, NextFunction } from 'express'; 

interface JwtUserPayload { 
  id: number; 
  email: string; 
} 

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => { 
  try { 
    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith('Bearer ')) { 
      return res.status(401).json({ message: "Access Denied. Signin Again." }); 
    } 

    const token = authHeader.split(' ')[1]; 

    const decoded = (jwt.verify(token as string, process.env.JWT_SECRET!) as unknown) as JwtUserPayload; 
    (req as any).user = decoded; 
    
    return next(); 
  } 
  catch (error: any) { 
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired", expired: true });
    } 
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Invalid token." });
    } 
    res.status(500).json({ 
      message: 'Internal Server Error'
    }) 
  } 
} 