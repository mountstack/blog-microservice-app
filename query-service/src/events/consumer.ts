import { Channel } from 'amqplib'; 
import { io } from "../websocket/app"; 
import { UserProjection } from '../APIs/entities/UserProjection'; 
import { PostProjection } from '../APIs/entities/PostProjection'; 
import { Comment } from '../APIs/entities/Comment'; 
import { appDataSource } from '../config/database'; 

export async function startConsumer(channel: Channel): Promise<void> {
  await channel.assertExchange('blog_bus', 'fanout', { durable: false });
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(q.queue, 'blog_bus', '');

  channel.consume(q.queue, (msg) => {
    if (msg !== null) {
      const { type, data } = JSON.parse(msg.content.toString());
      handleEvent(type, data);
      channel.ack(msg);
    }
  }); 
} 

async function handleEvent(type: string, data: any) {
  const userRepository = appDataSource.getRepository(UserProjection);
  const postRepository = appDataSource.getRepository(PostProjection);
  const commentRepository = appDataSource.getRepository(Comment);

  if (type === 'UserCreated') { 
    try { 
      const { id, email } = data; 
      const newUser = userRepository.create({ id, email }); 
      await userRepository.save(newUser); 
      
      console.log('[UserCreated]', { id, email }); 
    } 
    catch (error: any) { 
      console.error('[UserCreated] failed:', error.message); 
    } 
  } 

  if (type === 'ProfileUpdated') { 
    try { 
      const { userId } = data; 
      const user = await userRepository.findOne({ where: { id: userId } }); 
      
      if (!user) { 
        console.warn(`[ProfileUpdated] Warning: Projection for User ID ${userId} not found.`);
        return; 
      } 

      const updatedUser = profileUpdateDataWithScore(data, user); 
      await userRepository.save(updatedUser); 

      // web-socket. send data to frontend 
      io && io.to(`user:${userId}`).emit("profile-updated", { 
        userId, 
        bio: updatedUser.bio, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        gender: updatedUser.gender, 
        avatarUrl: updatedUser.avatarUrl, 
        phoneNumber: updatedUser.phoneNumber, 
        profileCompletion: updatedUser.profileCompletion, 
      }); 

      console.log('[ProfileUpdated]', updatedUser); 
    } 
    catch (error: any) { 
      console.error('[ProfileUpdated] failed:', error.message);
    } 
  } 

  if (type === 'PostCreated') {
    try {
      const { id, title, imageUrl = null, bgColor, userId } = data;
      const user = await userRepository.findOneBy({ id: userId });
      if (!user) throw new Error(`User ${userId} not found`); 

      const newPost = postRepository.create({ id, title, imageUrl, bgColor, user });
      await postRepository.save(newPost); 

      await userRepository.increment({ id: userId }, 'totalPosts', 1);

      console.log('[PostCreated]', { id, userId, title, imageUrl });
    } 
    catch (error: any) {
      console.error('[PostCreated] failed:', error.message);
    }
  } 

  if (type === 'CommentCreated') {
    try {
      const { id, content, postId, userId } = data;
      const newComment = commentRepository.create({
        id, content,
        user: { id: userId } as UserProjection,
        post: { id: postId } as PostProjection,
      });
      await commentRepository.save(newComment);

      await postRepository.increment({ id: postId }, 'totalComments', 1);
      console.log('[CommentCreated]', { id, postId, userId });
    } 
    catch (error: any) {
      console.error('[CommentCreated] failed:', error.message);
    }
  } 
} 


function profileUpdateDataWithScore(data: any, user: any): any { 
  const { userId, name, bio, gender, avatarUrl, phoneNumber } = data; 

  if (bio) user.bio = bio; 
  if (name) user.name = name; 
  if (gender) user.gender = gender; 
  if (avatarUrl) user.avatarUrl = avatarUrl; 
  if (phoneNumber) user.phoneNumber = phoneNumber; 

  // Re-calculate score always
  let score = 10; 
  if (user.name && user.name.trim() !== "") score += 20; 
  if (user.avatarUrl && user.avatarUrl.trim() !== "") score += 25; 
  if (user.bio && user.bio.trim() !== "") score += 20; 
  if (user.gender && user.gender.trim() !== "") score += 10; 
  if (user.phoneNumber && user.phoneNumber.trim() !== "") score += 15; 

  user.profileCompletion = Math.min(score, 100); 

  return user; 
} 