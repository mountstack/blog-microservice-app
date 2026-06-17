import { Request, Response } from 'express';
import { appDataSource } from '../config/database'; 
import { Profile } from '../entities/Profile';
import { publishEvent } from '../config/rabbitmq'; 
import { User } from '../entities/User';

export const updateProfile = async (req: Request, res: Response) => { 
  try { 
    const userId = (req as any).user?.id; 
    const { name, avatarUrl, bio, phoneNumber, gender } = req.body; 

    if (!userId) { 
      return res.status(401).json({ message: 'Unauthorized.' }); 
    } 

    if(name) {
      const userRepository = appDataSource.getRepository(User); 
      const user = await userRepository.findOne({where: {id: userId}}); 

      if (!user) { 
        return res.status(404).json({ message: 'User not found.' }); 
      } 

      user.name = name; 
      await userRepository.save(user); 
    } 

    const profileRepository = appDataSource.getRepository(Profile); 
    const profile = await profileRepository.findOne({ where: { userId } }); 

    if (!profile) { 
      return res.status(404).json({ message: 'Profile not found.' }); 
    } 

    if (bio) profile.bio = bio; 
    if (gender) profile.gender = gender; 
    if (avatarUrl) profile.avatarUrl = avatarUrl; 
    if (phoneNumber) profile.phoneNumber = phoneNumber; 

    await profileRepository.save(profile); 

    publishEvent({
      type: 'ProfileUpdated',
      data: {
        userId, 
        name, 
        bio: profile.bio,
        gender: profile.gender,
        avatarUrl: profile.avatarUrl,
        phoneNumber: profile.phoneNumber 
      }
    }); 

    return res.status(200).json({ 
      message: 'Profile updated.' 
    }); 

  } catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};