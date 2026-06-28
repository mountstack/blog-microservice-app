import { Request, Response } from 'express';
import { appDataSource } from '../config/database'; 
import { Profile } from '../entities/Profile';
import { publishEvent } from '../config/rabbitmq'; 

export const updateProfile = async (req: Request, res: Response) => { 
  try { 
    const userId = (req as any).user?.id; 
    const { name, avatarUrl, bio, phoneNumber, gender } = req.body; 

    const profileRepository = appDataSource.getRepository(Profile); 
    const profile = await profileRepository.findOne({ where: { userId } }); 

    if (!profile) { 
      return res.status(404).json({ message: 'Profile not found.' }); 
    } 

    if (bio) profile.bio = bio; 
    if (name) profile.name = name; 
    if (gender) profile.gender = gender; 
    if (avatarUrl) profile.avatarUrl = avatarUrl; 
    if (phoneNumber) profile.phoneNumber = phoneNumber; 

    await profileRepository.save(profile); 

    publishEvent({ 
      type: 'ProfileUpdated', 
      data: { 
        userId, 
        bio: profile.bio, 
        name: profile.name, 
        gender: profile.gender, 
        avatarUrl: profile.avatarUrl, 
        phoneNumber: profile.phoneNumber 
      } 
    }); 

    return res.status(200).json({ 
      message: 'Profile updated.' 
    }); 

  } 
  catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};