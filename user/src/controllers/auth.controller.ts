import { Request, Response } from 'express';
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
import { EntityManager } from 'typeorm';

import { appDataSource } from "../config/database";
import { User } from "../entities/User";
import { RefreshToken } from "../entities/RefreshToken";
import { LessThan } from 'typeorm';
import { publishEvent } from '../config/rabbitmq';
import { Profile } from '../entities/Profile';

const userRepository = appDataSource.getRepository(User);
const refreshTokenRepository = appDataSource.getRepository(RefreshToken);

export const registration = async (req: Request, res: Response) => { 
  const { email, password } = req.body; 
  
  const user = await userRepository.findOne({ where: { email } });
  if(user) { 
    return res.status(400).json({ message: 'This email is already in use.' }); 
  } 

  const salt = await bcrypt.genSalt(10); 
  const hash = await bcrypt.hash(password, salt); 

  // Save data in users & profiles table 
  const result = await appDataSource.transaction( 
    async (transactionalEntityManager: EntityManager) => { 
      const newUser = transactionalEntityManager.create(User, { email, password: hash }); 
      const savedUser = await transactionalEntityManager.save(User, newUser); 

      const profileData: Partial<Profile> = { 
        user: savedUser 
      }; 

      const newProfile = transactionalEntityManager.create(Profile, profileData); 
      await transactionalEntityManager.save(Profile, newProfile); 

      return savedUser; 
    } 
  ); 

  // Publish Event 
  publishEvent({ 
    type: "UserCreated", 
    data: { 
      id: result?.id, 
      email, 
      isSuspended: result?.isSuspended, 
    } 
  }); 
  // --- END --- 

  res.json({ 
    message: 'User created successfully', 
    result 
  }) 
} 

export const login = async (req: Request, res: Response) => { 
  const { email, password } = req.body; 

  if(!email || !password) return res.json({ message: 'Enter email & password!' });

  const user = await userRepository.findOne({ 
    where: { email }, 
    select: { 
      id: true, 
      email: true, 
      password: true, 
      name: true, 
      isSuspended: true 
    } 
  }); 
  if(!user) return res.json({ message: 'Invalid email or password!' }); 

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  } 

  // CLEANING: Remove All EXPIRED OLD Tokens 
  await refreshTokenRepository.delete({ 
    userId: user.id, 
    expiresAt: LessThan(new Date()) 
  }); 
  // --- END --- 

  const accessToken = jwt.sign( 
    { id: user.id, email: user.email }, 
    process.env.JWT_SECRET, 
    { expiresIn:  process.env.JWT_SECRET_EXPIRES_IN } 
  ); 

  const refreshToken = jwt.sign( 
    { id: user.id }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN } 
  ); 

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const newRefreshToken = refreshTokenRepository.create({ 
    token: refreshToken, 
    device: req.headers["user-agent"] || "Unknown Device", 
    expiresAt, 
    userId: user.id, 
  }); 
  await refreshTokenRepository.save(newRefreshToken);

  const cookieOptions = { 
    httpOnly: true, 
    sameSite: 'strict' as const, 
    maxAge: 24 * 60 * 60 * 1000, 
    secure: process.env.NODE_ENV === 'production', 
  }; 

  res.cookie('refreshToken', refreshToken, cookieOptions); 
  res.status(200).json({ 
    message: "Login successful!", 
    accessToken: `Bearer ${accessToken}`, 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      isSuspended: user.isSuspended,
    } 
  }); 
} 

export const generateRefreshToken = async (req: Request, res: Response) => { 
  try { 
    const tokenFromCookie = req.cookies?.refreshToken; 

    if (!tokenFromCookie) { 
      return res.status(401).json({ message: "Refresh token missing. Please login again." });
    } 

    const decoded = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET!) as { id: number; exp: number }; 

    const refreshToken = await refreshTokenRepository.findOne({ 
      where: { token: tokenFromCookie }, 
      relations: { user: true } 
    }); 

    if (!refreshToken) { 
      return res.status(403).json({ message: "Invalid or expired refresh token." }); 
    } 

    const user = refreshToken.user; 

    const newAccessToken = jwt.sign( 
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET!, 
      { expiresIn: process.env.JWT_SECRET_EXPIRES_IN } 
    ); 

    // THE CRITICAL: 
    // Final 8-HOUR SLIDING WINDOW LOGIC 
    // If user request to refresh access-token  
    // during the end of last 8 hours of refresh token. 
    // Then we will generate a new refresh token too. 
    // to keep him active for next 7 days. 

    const nowInSeconds = Math.floor(Date.now() / 1000); 
    const timeLeftInSeconds = decoded.exp - nowInSeconds; 
    const EIGHT_HOURS_IN_SECONDS = 8 * 60 * 60; 

    // If more than 8 hours left to expire refresh token... 
    if (timeLeftInSeconds > EIGHT_HOURS_IN_SECONDS) { 
      return res.status(200).json({ 
        message: "New Access Token!", 
        accessToken: `Bearer ${newAccessToken}`, 
      }); 
    } 

    // Remove old token
    await refreshTokenRepository.delete({ token: tokenFromCookie });

     // Rotate refresh token 
    const newRefreshToken = jwt.sign( 
      { id: user.id }, 
      process.env.JWT_REFRESH_SECRET!, 
      { expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRES_IN } 
    ); 

    const expiresAt = new Date(); 
    expiresAt.setDate(expiresAt.getDate() + 7); 

    // Create new token 
    const newSession = refreshTokenRepository.create({ 
      token: newRefreshToken, 
      device: req.headers["user-agent"] || "Unknown Device", 
      expiresAt, 
      userId: user.id, 
    }); 
    await refreshTokenRepository.save(newSession); 

    const cookieOptions = { 
      httpOnly: true, 
      sameSite: "strict" as const, 
      secure: process.env.NODE_ENV === "production", 
      maxAge: 7 * 24 * 60 * 60 * 1000 
    }; 

    res.cookie("refreshToken", newRefreshToken, cookieOptions); 


    return res.status(200).json({
      message: "RefreshToken Rotated & New Access Token Given", 
      accessToken: `Bearer ${newAccessToken}`,
    });
  } 
  catch (error) { 
    res.status(500).json({ error: "Internal Server Error" }); 
  } 
} 
