import { Channel } from 'amqplib'; 
import { User } from '../entities/User'; 
import { Post } from '../entities/Post'; 
import { Comment } from '../entities/Comment'; 
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
  const userRepository = appDataSource.getRepository(User);
  const postRepository = appDataSource.getRepository(Post);
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

  if (type === 'PostCreated') {
    try {
      const { id, title, userId } = data;
      const user = await userRepository.findOneBy({ id: userId });
      if (!user) throw new Error(`User ${userId} not found`);
      const newPost = postRepository.create({ id, title, user });
      await postRepository.save(newPost);
      console.log('[PostCreated]', { id, title, userId });
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
        user: { id: userId } as User,
        post: { id: postId } as Post,
      });
      await commentRepository.save(newComment);
      await postRepository.increment({ id: postId }, 'commentCount', 1);
      console.log('[CommentCreated]', { id, postId, userId });
    } 
    catch (error: any) {
      console.error('[CommentCreated] failed:', error.message);
    }
  } 
} 